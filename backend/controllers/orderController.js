const asyncHandler = require('express-async-handler');
const Product=require("../models/Product")
const Cart=require("../models/Cart");
const User = require("../models/User");
const Order= require("../models/Order");
const Seller= require("../models/Seller");

const generateTrackingId= require("../utils/generateTrackingId");
const generateOrderId= require("../utils/generateOrderId");

//place  new order
//route /api/order/create-order
//acess private;

exports.createOrder= asyncHandler(async(req,res)=>{
	
	const userId=req.userId;
	const {paymentMethod,address}= req.body;
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

	const newOrder= new Order({
	orderId:generateOrderId(),
		status:"pending",

		buyer:user?._id,
		seller:seller._id,
		orderDate:Date.now(),
		amount:p.quantity*p.product.price,
		quantity:p.quantity,
		trackingId:generateTrackingId(),
		paymentMethod:paymentMethod,
		address:user.address,
		pincode:user.pincode,
		product:p.product._id
		
	})
	// newOrderDetails= await newOrder.save();
	const orderDetails= await newOrder.save();
	seller.orders.push(orderDetails._id)
user.orders.push(orderDetails._id);

orderArr.push( orderDetails);
await seller.save();
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

// getOrderDetails traking id
// route /api/order/get-details-tackingId/:trackingId
// access private

exports.getOrderDetailsByTrackingId=asyncHandler(async(req,res)=>{
const orderId= req.params.trackingId;
const order=await  Order.find({trackingId:orderId});
if(!order){
	throw new Error("order details not found");

}
res.status(200).json({
	status:"success",
	message:"order details fetched successffuly",
	order
})

})
// getOrderAllOrders
// route /api/order/get-all-orders
// access private

exports.getAllOrders=asyncHandler(async(req,res)=>{
const orderId= req.params.trackingId;
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
	const orderId= req.params.trackingId;
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