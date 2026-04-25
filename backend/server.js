const express=require("express");
const app= express();
const cloudinary = require('cloudinary').v2;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const userRoutes= require("./routes/userRoutes");
const productRoutes= require("./routes/productRoutes");
const cartRoutes= require("./routes/cartRoutes");
const sellerRoutes= require("./routes/sellerRoutes");

const orderRoutes= require("./routes/orderRoutes");

const connectDB= require("./database");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const cors = require("cors");
app.use(cors({
    origin: "*",
     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
}));


cloudinary.config({
    secure: true
});
app.use(express.json());
//user router
app.use("/api/auth",userRoutes);
//product router
app.use("/api/product",productRoutes);
//cart router
app.use("/api/cart",cartRoutes);
//seller router
app.use("/api/seller/auth",sellerRoutes);
//order router
app.use("/api/order",orderRoutes);

  app.use(globalErrorHandler);
  
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "blogspire-backend",

    timestamp: new Date().toISOString(),
  });
});
const port=3030;


   connectDB()
    app.listen(port,()=>{
      console.log("server is running on port "+port);})
   

