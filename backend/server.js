const express=require("express");
const app= express();
const cloudinary = require('cloudinary').v2;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const userRoutes= require("./routes/userRoutes");
const productRoutes= require("./routes/productRoutes");
const cartRoutes= require("./routes/cartRoutes");
const sellerRoutes= require("./routes/sellerRoutes");
const  rateLimit = require("express-rate-limit")
const orderRoutes= require("./routes/orderRoutes");

const connectDB= require("./config/database");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const cors = require("cors");
const {connectRedis} = require("./config/redis");
app.use(cors({
    origin: "*",
     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
}));
let limiter= rateLimit({ max:1000,
windowMs:60*60*1000,
    message:"we have received too many requests form this IP, please try  again later"
})
app.use('/api/auth',limiter)

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

const frontendDist = path.join(__dirname, "dist");
app.use(express.static(frontendDist));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

const port = Number(process.env.PORT) || 3000;


const startServer = async () => {
  await connectDB();
    await connectRedis();
  app.listen(port, "0.0.0.0", () => {
      console.log("server is running on port " + port);

  });
};

startServer().catch(() => {
  process.exitCode = 1;
});
   
