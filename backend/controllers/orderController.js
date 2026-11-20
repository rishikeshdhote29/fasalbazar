const asyncHandler = require('express-async-handler');
const Cart=require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const Order= require("../models/Order");
const Seller= require("../models/Seller");
// const Razorpay = require('razorpay');
const instance=require("../payment/razorpay");
const generateTrackingId= require("../utils/generateTrackingId");
const generateOrderId= require("../utils/generateOrderId");
const {sendOrderConfirmationEmail} = require("../utils/orderEmail");
const {sendOrderCancellationEmail} = require("../utils/orderCancelEmail");
const crypto = require("node:crypto");
// var { validatePaymentVerification, validateWebhookSignature } = require('./dist/utils/razorpay-utils');





//place  new order
//route /api/order/create-order
//acess private;
//

exports.createOrder = asyncHandler(async (req, res) => {

    const userId = req.userId;

    // Get user
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            status: "failed",
            message: "User not found"
        });
    }

    // Get cart
    const cart = await Cart.findById(user.cart)
        .populate("products.product");

    if (!cart || cart.products.length === 0) {
        return res.status(400).json({
            status: "failed",
            message: "Cart is empty"
        });
    }

    let totalPrice = 0;
    const unavailableItems = cart.products.filter((item) => !item.product);
    if (unavailableItems.length > 0) {
        cart.products = cart.products.filter((item) => item.product);
        await cart.save();
        return res.status(400).json({
            status: "failed",
            message: "One or more products are no longer available and were removed from your cart"
        });
    }

    // Validate stock and calculate total
    for (const p of cart.products) {

        const product = p.product;

        if (!product) {
            return res.status(404).json({
                status: "failed",
                message: "Product not found"
            });
        }

        if (product.quantity < p.quantity) {
            return res.status(400).json({
                status: "failed",
                message: `Insufficient stock for ${product.name}. Only ${product.quantity} unit(s) available`
            });
        }

        const discount = Math.min(Math.max(Number(product.discount) || 0, 0), 100);
        const discountedPrice = product.price * (1 - discount / 100);
        totalPrice += p.quantity * discountedPrice;
    }

    // Razorpay expects amount in paise
    if (!Number.isInteger(Math.round(totalPrice * 100)) || totalPrice <= 0) {
        return res.status(400).json({
            status: "failed",
            message: "Order total must be greater than zero"
        });
    }

    const options = {
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    // Create Razorpay order
    const order = await instance.orders.create(options);

    return res.status(200).json({
        status: "success",
        message: "Razorpay order created successfully",
        data: {
            id: order.id,
            razorpayOrderId: order.id,
            amount: order.amount,
            currency: order.currency
        }
    });

});



exports.verifyPayment= asyncHandler(async(req,res)=>{
    const {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
            success: false,
            message: "Payment details are incomplete"
        });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
            success: false,
            message: "Payment verification is not configured"
        });
    }

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(razorpaySignature, "hex");
    const isAuthentic = expected.length === received.length &&
        crypto.timingSafeEqual(expected, received);

    if (!isAuthentic) {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });
    }

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const cart = await Cart.findById(user.cart).populate("products.product");
    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const alreadyProcessed = await Order.find({ paymentId: razorpayPaymentId });
    if (alreadyProcessed.length > 0) {
        return res.status(200).json({
            success: true,
            message: "Payment already verified",
            orders: alreadyProcessed
        });
    }

    const address = req.body.address || user.address || "Address not provided";
    const pincode = req.body.pincode || user.pincode || "Not provided";
    const paymentMethod = req.body.paymentMethod || "online";
    const orderDetails = [];

    for (const item of cart.products) {
        const product = await Product.findById(item.product?._id || item.product);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (product.quantity < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${product.name}`
            });
        }

        const seller = await Seller.findById(product.seller);
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        const order = await new Order({
            orderId: generateOrderId(),
            status: "order placed",
            buyer: user._id,
            seller: seller._id,
            amount: item.quantity * product.price *
                (1 - Math.min(Math.max(Number(product.discount) || 0, 0), 100) / 100),
            quantity: item.quantity,
            trackingId: generateTrackingId(),
            paymentMethod,
            paymentId: razorpayPaymentId,
            address,
            pincode,
            product: product._id
        }).save();

        product.quantity -= item.quantity;
        product.isAvailable = product.quantity > 0;
        await product.save();

        seller.orders.push(order._id);
        await seller.save();
        user.orders.push(order._id);
        orderDetails.push(order);

        try {
            await sendOrderConfirmationEmail(user.email, order);
        } catch (emailError) {
            console.error("Email sending failed but order was created:", emailError);
        }
    }

    cart.products = [];
    await cart.save();
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Payment verified and order placed successfully",
        orders: orderDetails
    });

})


// getOrderDetails
// route /api/order/get-details/:id
// access private

exports.getOrderDetails=asyncHandler(async(req,res)=>{
const orderId= req.params.id;
const order = /^[a-f\d]{24}$/i.test(orderId)
  ? await Order.findById(orderId)
  : await Order.findOne({ orderId });
if(!order){
	throw new Error("order details not found");

}
if (order.buyer.toString() !== req.userId) {
	return res.status(403).json({
		status: "failed",
		message: "you are not authorized to view this order"
	});
}
res.status(200).json({
	status:"success",
	message:"order details fetched successffuly",
	order
})

})

// getOrderDetails tracking id
// route /api/order/get-details-tackingId/:trackingId
// access public (tracking by id doesn't require auth)
exports.getOrderDetailsByTrackingId=asyncHandler(async(req,res)=>{
	const trackingId = req.params.trackingId;
	// findOne to return a single matching order
	const order = await Order.findOne({ trackingId }).populate(
		"product",
		" name images price discount quantity isAvailable "
	);
	if(!order){
		return res.status(404).json({ status: "failed", message: "order details not found" });
	}
	res.status(200).json({
		status: "success",
		message: "order details fetched successfully",
		order: {
			trackingId: order.trackingId,
			orderId: order.orderId,
			status: order.status,
			orderDate: order.orderDate,
			quantity: order.quantity,
			amount: order.amount,
			product: order.product
		}
	})

})
// getOrderAllOrders
// route /api/order/get-all-orders
// access private

exports.getAllOrders=asyncHandler(async(req,res)=>{
const userId=req.userId;

	const user = await User.findById(userId).populate({
		path: "orders",
		model: "Order",
		options: { sort: { createdAt: -1 } },
		populate: {
			path: "product",
			model: "Product"
		}
	});
if(!user) {
	throw new Error("order list not found");

}
res.status(200).json({
	status:"success",
	message:"order details list  fetched successffuly",
	orders  :user.orders


})})
// farmer getOrderAllOrders
// route /api/order/get-all-seller-order
// access private

exports.getAllSellerOrders=asyncHandler(async(req,res)=>{
	const userId=req.userId;

	const user = await Seller.findById(userId).populate({
		path: "orders",
		model: "Order",
		options: { sort: { createdAt: -1 } },
		populate: {
			path: "product",
			model: "Product"
		}
	});
	if(!user) {
		throw new Error("order list not found");

	}
	res.status(200).json({
		status:"success",
		message:"order details list  fetched successffuly",
		orders  :user.orders


	})})


				// update order status by seller
				// route /api/order/update-order-status/:id
				// access private (seller)
				exports.updateOrderStatusBySeller=asyncHandler(async(req,res)=>{
					const sellerId = req.userId;
					const orderId = req.params.id;
					const { status } = req.body;

									const order = /^[a-f\d]{24}$/i.test(orderId)
										? await Order.findById(orderId).populate('buyer')
										: await Order.findOne({ orderId }).populate('buyer');
					if(!order){
						return res.status(404).json({status:'failed', message:'order not found'});
					}

					if(order.seller.toString() !== sellerId){
						return res.status(403).json({status:'failed', message:'you are not authorized to update this order'});
					}

					const allowedStatuses = ['order placed','processing','shipped','out for delivery','delivered','cancelled'];
					if(!allowedStatuses.includes(status)){
						return res.status(400).json({status:'failed', message:'invalid status'});
					}

					if(order.status === 'cancelled'){
						return res.status(400).json({status:'failed', message:'cancelled orders cannot be changed'});
					}
					if(order.status === 'delivered'){
						return res.status(400).json({status:'failed', message:'delivered orders cannot be changed or cancelled'});
					}
					if(status === 'cancelled' && order.status === 'shipped'){
						return res.status(400).json({status:'failed', message:'orders already shipped cannot be cancelled'});
					}
					if(status === 'cancelled' && order.status === 'out for delivery'){
						return res.status(400).json({status:'failed', message:'orders already out for delivery cannot be cancelled'});
					}

					// If seller cancels the order, restore stock and notify buyer
					if(status === 'cancelled'){
						order.status = 'cancelled';
						try{
							await sendOrderCancellationEmail(order.buyer.email, order);
						}catch(e){
							console.error('Failed to send cancellation email:', e);
						}

						const product = await Product.findByIdAndUpdate(
							order.product,
							{
								$inc: { quantity: order.quantity },
								$set: { isAvailable: true }
							},
							{ new: true }
						);
						if(!product){
							return res.status(404).json({status:'failed', message:'product not found'});
						}

						await order.save();
						return res.status(200).json({status:'success', message:'order cancelled by seller', order});
					}

					// normal status update
					order.status = status;
					await order.save();
					res.status(200).json({status:'success', message:'order status updated', order});
				})



//cencel order
// route /api/order/cencel
// access private

exports.cancelOrder=asyncHandler(async(req,res)=>{
	const userId=req.userId;
const orderId= req.params.id;
const orderDetails = /^[a-f\d]{24}$/i.test(orderId)
	? await Order.findById(orderId).populate("buyer")
	: await Order.findOne({ orderId }).populate("buyer");
if(!orderDetails){
	return res.status(404).json({status:"failed",message:"order not found"});
}
if(orderDetails.buyer._id.toString() !== userId){
	throw new Error("you are not authorized to cancel this order");
}

if(orderDetails.status === 'cancelled'){
	return res.status(400).json({status:"failed",message:"order is already cancelled"});
}
if(orderDetails.status === 'delivered'){
	return res.status(400).json({status:"failed",message:"delivered orders cannot be cancelled"});
}
if(orderDetails.status === 'shipped' || orderDetails.status === 'out for delivery'){
	return res.status(400).json({status:"failed",message:"this order can no longer be cancelled"});
}

orderDetails.status="cancelled";
await sendOrderCancellationEmail(orderDetails.buyer.email, orderDetails);

const product = await Product.findByIdAndUpdate(
	orderDetails.product,
	{
		$inc: { quantity: orderDetails.quantity },
		$set: { isAvailable: true }gti
	},
	{ new: true }
);
if(!product){
	return res.status(404).json({status:"failed",message:"product not found"});
}

await orderDetails.save();


	
	res.status(200).json({
		status:"success",
		message:"order cancelled successffuly",
		orderDetails


	})})
// get single order details for seller
// route /api/order/get-seller-details/:id
// access private (seller)
exports.getSellerOrderDetails = asyncHandler(async (req, res) => {
  const sellerId = req.userId;
  const orderId = req.params.id;

  const order = /^[a-f\d]{24}$/i.test(orderId)
	? await Order.findById(orderId).populate('product').populate('buyer')
	: await Order.findOne({orderId}).populate('product').populate('buyer');
  if (!order) {
	return res.status(404).json({ status: 'failed', message: 'order not found' });
  }
  if (order.seller.toString() !== sellerId) {
	return res.status(403).json({ status: 'failed', message: 'not authorized to view this order' });
  }

  res.status(200).json({ status: 'success', message: 'order fetched', order });
});