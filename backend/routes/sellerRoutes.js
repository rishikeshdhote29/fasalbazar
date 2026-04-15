const express = require('express');
const Router=   express.Router();

const {register,  updateProfile, sellerProfile, loginSeller} = require("../controllers/sellerController");
const {isLoggedin} = require("../middleware/isLoggedin");

Router.post("/register",register);
Router.post("/login",loginSeller);
Router.get("/profile",isLoggedin,sellerProfile)
Router.put("/profile",isLoggedin,updateProfile)
Router.get("/profile",isLoggedin,sellerProfile)




module.exports=Router;
