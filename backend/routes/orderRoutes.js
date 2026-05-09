const Router= require("express").Router();
const {isLoggedin} = require("../middleware/isLoggedin");
const {createOrder, getOrderDetails, getOrderDetailsByTrackingId, getAllOrders, getAllSellerOrders, cancelOrder} = require("../controllers/orderController");
const {isSellerLoggedin} = require("../middleware/isSellerLoggedin");

//pace order
Router.post("/create-order",isLoggedin,createOrder);
//get orderd etail by id
Router.get("/get-details/:id",isLoggedin,getOrderDetails)
//get orderd detail by trackign id (public - tracking by id doesn't require auth)
Router.get("/get-details-tackingId/:trackingId", getOrderDetailsByTrackingId)
//fetch  all orders list
Router.get("/get-orders-list",isLoggedin,getAllOrders)
//fetch all seller order
Router.get("/get-seller-orders-list",isSellerLoggedin,getAllSellerOrders)
// get single order detail for seller
Router.get("/get-seller-details/:id", isSellerLoggedin, require("../controllers/orderController").getSellerOrderDetails)
//cancel order
Router.put("/cancel-order/:id",isLoggedin,cancelOrder);

// seller updates order status
Router.put("/update-order-status/:id", isSellerLoggedin, require("../controllers/orderController").updateOrderStatusBySeller);

module.exports=Router;