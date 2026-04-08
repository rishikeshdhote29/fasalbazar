const asyncHandler = require("express-async-handler");

const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const Product = require("../models/Product");
const { deleteModel } = require("mongoose");

exports.createProduct = asyncHandler(async (req, res) => {
    
    const product = req.body;
    product.seller = req.userId;
    const newProduct = await Product.create(product);
    
    res.status(201).json({
        status: "success",
        message: "new product  created",
        newProduct
    })
    
    
    
});
//@ get all products
//@route get /api/products
//@access public
exports.getAllProducts= asyncHandler(async(req,res)=>{
    
    const products= await Product.find();
    
    if(!products){
        throw new Error("no products found");
    }
    res.status(200).json({
        status:"success",
        message:"products fetched successfully",
        products
    })
})

//@ delete product
// route delete /api/product/:id
// access private

exports.deleteProduct=asyncHandler(async(req,res)=>{
const productId= req.params.id;
const sellerId= req.userId;
const  product= await Product.findOne({_id:productId});
if(sellerId!=product.seller._id.toString()){
    throw new Error("you can only delete you product")
}
const deletedProduct=await Product.findByIdAndDelete({_id:productId});
res.status(201).json({
    status:"success",

    message:"product deleted successfuly",
    deletedProduct
})



})
