const Router= require("express").Router();
const {isLoggedin} = require("../middleware/isLoggedin");
const {createOrder, getOrderDetails, getOrderDetailsByTrackingId} = require("../controllers/orderController");

//pace order
Router.post("/create-order",isLoggedin,createOrder);
//get orderd etail by id
Router.get("/get-details/:id",isLoggedin,getOrderDetails)
//get orderd detail by trackign id
Router.get("/get-details-tackingId/:trackingId",isLoggedin,getOrderDetailsByTrackingId)
module.exports=Router;