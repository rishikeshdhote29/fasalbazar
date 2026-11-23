const express = require('express');
const Router=   express.Router();

const {register,  updateProfile, sellerProfile, loginSeller, forgetPassword, resetPassword} = require("../controllers/sellerController");
const {isSellerLoggedin} = require("../middleware/isSellerLoggedin");
const multer= require("multer")

const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});
Router.post("/register",register);
Router.post("/login",loginSeller);
Router.get("/profile",isSellerLoggedin,sellerProfile)
Router.put("/update-seller-profile",isSellerLoggedin, parser.single('image'),updateProfile)


Router.post("/forget-password", forgetPassword);
Router.put("/reset-password/:token", resetPassword);

module.exports=Router;
