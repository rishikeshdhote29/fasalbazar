const express = require('express');
const Router=   express.Router();

const {register,  updateProfile, sellerProfile, loginSeller} = require("../controllers/sellerController");
const {isLoggedin} = require("../middleware/isLoggedin");
const multer= require("multer")

const storage= require("../utils/cloudinary");
const parser= multer({storage});
Router.post("/register",register);
Router.post("/login",loginSeller);
Router.get("/profile",isLoggedin,sellerProfile)
Router.put("/update-profile",isLoggedin, parser.single('image'),updateProfile)
Router.get("/profile",isLoggedin,sellerProfile)




module.exports=Router;
