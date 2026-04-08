const express = require('express');
const Router=   express.Router();

const {register, loginUser, userProfile,updateProfile} = require("../controllers/userController");
const {isLoggedin} = require("../middleware/isLoggedin");

Router.post("/register",register);
Router.post("/login",loginUser);
Router.get("/profile",isLoggedin,userProfile)
Router.put("/profile",isLoggedin,updateProfile)



module.exports=Router;
