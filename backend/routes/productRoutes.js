const express = require('express');
const Router=   express.Router();

const {isSellerLoggedin} = require("../middleware/isSellerLoggedin");
const {createProduct, getAllProducts, deleteProduct} = require("../controllers/productController");

Router.post("/create",isSellerLoggedin,createProduct);
Router.get("/getAllProducts",getAllProducts);
Router .delete("/delete-product/:id",isSellerLoggedin,deleteProduct);





module.exports=Router;
