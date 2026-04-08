const asyncHandler = require('express-async-handler');
const Product=require("../models/Product")
const Cart=require("../models/Cart");
const User = require("../models/User");

// add  product to cart
// route /api/cart/add-product
// access private

//
// exports.addToCart=asyncHandler(async(req,res)=>{
//
// const productId= req.params.id;
// const buyerId= req.userId;
//
//  const quantity= req.body.quantity;
//  let buyer= await User.findById(buyerId);
//  const product= await Product.findById(productId);
// if(buyer.cart==null)
// {
//     const newCart= await Cart.create({buyer:buyerId,products:[]})
//     console.log("new cart",newCart)
//     buyer= await User.findByIdAndUpdate(buyerId,{$set:{cart:newCart._id}});
//
// }
// const newProduct={
//     product:productId,
//     quantity:quantity
// }
// const cart= await Cart.findById(buyer.cart);
// console.log("buyer",buyer.cart);
// 	if(!cart.product){
// 		cart.products.push(newProduct);
// 	}else{
//
//
// 	}
// console.log(cart);
// await cart.save();
//
//
// res.status(201).json({
//
//     status:"success",
//     message:"product added successfully",
//     finalCart
//
// })
//
//
//
// })


exports.addToCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const buyerId = req.userId;
  const quantity = req.body.quantity;

  // Ensure buyer exists
  let buyer = await User.findById(buyerId);

  // Ensure product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ status: "fail", message: "Product not found" });
  }

  // Create cart if buyer doesn't have one
  if (!buyer.cart) {
    const newCart = await Cart.create({ buyer: buyerId, products: [] });
    buyer = await User.findByIdAndUpdate(
      buyerId,
      { $set: { cart: newCart._id } },
      { new: true }
    );
  }

  // Now safely fetch the cart
  const cart = await Cart.findById(buyer.cart);
  console.log("buyer", buyer)
  if (!cart) {
    return res.status(404).json({ status: "fail", message: "Cart not found" });
  }

  // Check if product already exists in cart
  const existingProduct = cart.products.find(
    (p) => p.product.toString() === productId.toString()
  );

  if (existingProduct) {
    existingProduct.quantity = quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  const finalCart = await cart.save();

  res.status(201).json({
    status: "success",
    message: "Product added successfully",
    finalCart,
  });
});


// delete item form form cart
// route /api/cart/delete-product/:id
// access private

exports.deleteFromCart= asyncHandler(async(req,res)=>{
	 const productId=req.params.id;
	 const userId= req.userId;
	 const user= await  User.findById(userId);
	 if(!user.cart)
 throw new Error(" no  cart found");
	 
	 const cart= await  Cart.findById(user.cart)
	if(!cart.products)
		throw new Error("cart is empty")
	 const product= cart.products.find(p=>p.product.toString()===productId)
	if(!product){
		throw new Error("no product availbale in this cart")
		
	}
	
	cart.products=cart.products.filter(p=>p.product.toString()!==productId)
	console.log(cart.products);
	await cart.save();
	res.status(201).json({
		status:"sucess",
		message:"product deleted successfully",
		cart
	})
	
})

//get cart
// route /api/cart/get-cart
// access private

exports.getCart= asyncHandler(async(req,res)=>{
	 const userId= req.userId;
	 const user=await User.findById(userId);
	 const cart= await Cart.findById(user.cart).populate({path: "products.product",
	 })
	console.log(cart)
	if(!cart)
		throw new Error("cart not found");
	res.status(200).json({
		status:"success",
		message:"cart fetched successfuly",
		cart
	})
	
	
})