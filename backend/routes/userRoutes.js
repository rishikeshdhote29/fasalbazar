const express = require('express');
const Router=   express.Router();

const {register, loginUser, userProfile,updateProfile, forgetPassword, resetPassword} = require("../controllers/userController");
const {isLoggedin} = require("../middleware/isLoggedin");
const multer= require("multer")

const storage= require("../utils/cloudinary");
const parser= multer({storage});
Router.post("/register",register);
Router.post("/login",loginUser);
Router.get("/profile",isLoggedin,userProfile)
Router.put("/update-profile", isLoggedin, parser.single('image'), updateProfile)
Router.post("/forget-password", forgetPassword);
Router.put("/reset-password/:token", resetPassword);




module.exports=Router;
