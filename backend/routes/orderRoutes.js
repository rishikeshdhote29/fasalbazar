const Router= require("express").Router();
const {isLoggedin} = require("../middleware/isLoggedin");
const {createOrder, getOrderDetails, getOrderDetailsByTrackingId, getAllOrders, getAllSellerOrders} = require("../controllers/orderController");

//pace order
Router.post("/create-order",isLoggedin,createOrder);
//get orderd etail by id
Router.get("/get-details/:id",isLoggedin,getOrderDetails)
//get orderd detail by trackign id
Router.get("/get-details-tackingId/:trackingId",isLoggedin,getOrderDetailsByTrackingId)
//fetch  all orders list
Router.get("/get-orders-list",isLoggedin,getAllOrders)
//fetch all seller order
Router.get("/get-seller-orders-list",isLoggedin,getAllSellerOrders)


module.exports=Router;