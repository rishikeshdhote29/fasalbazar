const Router= require("express").Router();
const { addToCart, deleteFromCart, getCart} = require("../controllers/cartController");
const { isLoggedin } = require("../middleware/isLoggedin")

Router.put("/add-to-cart/:id",isLoggedin,addToCart);
Router.put("/delete-form-cart/:id",isLoggedin,deleteFromCart);

Router.get("/get-cart",isLoggedin,getCart);
module.exports=Router;

