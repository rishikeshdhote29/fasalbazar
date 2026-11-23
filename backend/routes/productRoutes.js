const express = require('express');
const Router=   express.Router();

const {isSellerLoggedin} = require("../middleware/isSellerLoggedin");
const {createProduct, getAllProducts, deleteProduct, sellerListing, updateProduct, productDetails, searchProducts} = require("../controllers/productController");
const multer= require("multer")

const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});
Router.post("/create",isSellerLoggedin,parser.single('image'),createProduct);
Router.put("/update/:id",isSellerLoggedin,parser.single('image'),updateProduct);
Router.get("/getAllProducts",getAllProducts);
Router.get("/seller/listing",isSellerLoggedin,sellerListing);
Router.get("/search",searchProducts);
Router.get("/:id",productDetails);
Router .delete("/delete-product/:id",isSellerLoggedin,deleteProduct);




module.exports=Router;
