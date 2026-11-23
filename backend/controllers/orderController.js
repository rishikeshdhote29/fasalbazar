const asyncHandler = require('express-async-handler');
const Cart=require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const Order= require("../models/Order");
const Seller= require("../models/Seller");

const generateTrackingId= require("../utils/generateTrackingId");
const generateOrderId= require("../utils/generateOrderId");
const {sendOrderConfirmationEmail} = require("../utils/orderEmail");
const {sendOrderCancellationEmail} = require("../utils/orderCancelEmail");


//place  new order
//route /api/order/create-order
//acess private;

exports.createOrder= asyncHandler(async(req,res)=>{
	
	const userId=req.userId;
	const {paymentMethod, address: reqAddress, pincode: reqPincode}= req.body;
	const user= await User.findById(userId);
	const cart= await Cart.findById(user.cart).populate({path:"products.product"});
	
	let totalPrice=0;
	cart.products.map((p)=>{
		totalPrice+=p.quantity*p.product.price;
	})

	 //payment integration will be here
const 	 isPaymentSuccessFull= true;
	let orderArr =[];

if(isPaymentSuccessFull){
	for (const p of cart.products) {
		const seller= await Seller.findById(p.product.seller);
		const product = p.product;

		// ✅ STOCK VALIDATION: Check if sufficient stock available
		if (product.quantity < p.quantity) {
			return res.status(400).json({
				status: "failed",
				message: `Insufficient stock for ${product.name}. Only ${product.quantity} unit(s) available`,
			});
		}

		const newOrder= new Order({
			orderId:generateOrderId(),
			status:"order placed",
			buyer:user?._id,
			seller:seller._id,
			orderDate:Date.now(),
			amount:p.quantity*p.product.price,
			quantity:p.quantity,
			trackingId:generateTrackingId(),
			paymentMethod: paymentMethod || 'Online Payment',
			address: reqAddress || user.address || 'Address not provided',
			pincode: reqPincode || user.pincode || 'Not provided',
			product:p.product._id
		})
		
		const orderDetails= await newOrder.save();
		seller.orders.push(orderDetails._id)
		user.orders.push(orderDetails._id);

		// ✅ STOCK DEDUCTION: Decrement product quantity after order created
		product.quantity -= p.quantity;
		
		// ✅ AVAILABILITY UPDATE: Mark as unavailable if stock reaches 0
		if (product.quantity <= 0) {
			product.isAvailable = false;
			product.quantity = 0;
		}
		await product.save();

		orderArr.push( orderDetails);
		await seller.save();
		
		// Send email after order is saved
		try {
			await sendOrderConfirmationEmail(user.email, orderDetails);
		} catch (emailError) {
			console.error("Email sending failed but order was created:", emailError);
		}
	}
cart.products=[];
await cart.save();
await user.save();
	res.status(200).json({
		status:"success",
		message:"order placed successfully",
		orderArr
	})
}
else{

res.status(500).json({
	status:"failed",
	message:"payment is failed"
})}
})

// getOrderDetails
// route /api/order/get-details/:id
// access private

exports.getOrderDetails=asyncHandler(async(req,res)=>{
const orderId= req.params.id;
const order=await  Order.findById(orderId);
if(!order){
	throw new Error("order details not found");

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
	const order = await Order.findOne({ trackingId }).populate('product').populate('buyer');
	if(!order){
		return res.status(404).json({ status: "failed", message: "order details not found" });
	}
	res.status(200).json({
		status: "success",
		message: "order details fetched successfully",
		order
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

					const order = await Order.findById(orderId).populate('buyer');
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

					// If seller cancels the order, restore stock and notify buyer
					if(status === 'cancelled'){
						order.status = 'cancelled';
						try{
							await sendOrderCancellationEmail(order.buyer.email, order);
						}catch(e){
							console.error('Failed to send cancellation email:', e);
						}

						const product = await Product.findById(order.product);
						if(product){
							product.quantity += order.quantity;
							if(product.quantity > 0) product.isAvailable = true;
							await product.save();
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
const orderDetails = await Order.findById(orderId).populate("buyer");
if(userId!== orderDetails.buyer._id.toString()){
	throw new Error("you are not authorized to cancel this order");
}


 orderDetails.status="cancelled";
await sendOrderCancellationEmail(orderDetails.buyer.email, orderDetails);

const product = await Product.findById(orderDetails.product);
product.quantity+= orderDetails.quantity;
if(product.quantity>0){
	product.isAvailable=true;
}

await product.save();
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

  const order = await Order.findOne({orderId}).populate('product').populate('buyer');
  if (!order) {
	return res.status(404).json({ status: 'failed', message: 'order not found' });
  }
  if (order.seller.toString() !== sellerId) {
	return res.status(403).json({ status: 'failed', message: 'not authorized to view this order' });
  }

  res.status(200).json({ status: 'success', message: 'order fetched', order });
});