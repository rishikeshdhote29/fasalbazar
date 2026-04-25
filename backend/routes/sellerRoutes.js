const express = require('express');
const Router=   express.Router();

const {register,  updateProfile, sellerProfile, loginSeller} = require("../controllers/sellerController");
const {isSellerLoggedin} = require("../middleware/isSellerLoggedin");
const multer= require("multer")

const storage= require("../utils/cloudinary");
const parser= multer({storage});
Router.post("/register",register);
Router.post("/login",loginSeller);
Router.get("/profile",isSellerLoggedin,sellerProfile)
Router.put("/update-profile",isSellerLoggedin, parser.single('image'),updateProfile)




module.exports=Router;
