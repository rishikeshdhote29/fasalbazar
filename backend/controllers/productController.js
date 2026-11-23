const asyncHandler = require("express-async-handler");
const Seller = require("../models/Seller");
const redis= require("redis");
const Product = require("../models/Product");
const {redisClient} = require("../config/redis");
const cloudinary = require("cloudinary").v2;

const uploadProductImage = (file) => new Promise((resolve) => {
  if (!file?.buffer) {
    resolve(null);
    return;
  }

  const timeout = setTimeout(() => resolve(null), 15000);
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "FasalBazar",
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }]
    },
    (error, result) => {
      clearTimeout(timeout);
      resolve(error ? null : result.secure_url);
    }
  );
  stream.end(file.buffer);
});

exports.createProduct = asyncHandler(async (req, res) => {
    console.log(req.body);
    const product = { ...req.body };
    product.price = Number(product.price);
    product.discount = product.discount === "" ? 0 : Number(product.discount);
    product.quantity = Number(product.quantity);
    product.seller = req.userId;

    if (!product.name || !product.description) {
        return res.status(400).json({
            status: "fail",
            message: "Product name and description are required"
        });
    }

    if (!Number.isFinite(product.price) || product.price <= 0) {
        return res.status(400).json({
            status: "fail",
            message: "Product price must be greater than 0"
        });
    }

    if (!Number.isFinite(product.discount) || product.discount < 0) {
        return res.status(400).json({
            status: "fail",
            message: "Product discount must be 0 or greater"
        });
    }
    
    if (!Number.isFinite(product.quantity) || product.quantity <= 0) {
        return res.status(400).json({
            status: "fail",
            message: "Product quantity must be greater than 0"
        });
    }

    if (req.file) {
        const uploadedUrl = await uploadProductImage(req.file);
        if (uploadedUrl) {
            product.images = uploadedUrl;
        }
    }

    const user = await Seller.findById(req.userId);
    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "Seller not found"
        });
    }
   
    const newProduct = await Product.create(product);
    user.products.push(newProduct._id)
    await user.save();

    res.status(201).json({
        status: "success",
        message: "new product created",
        newProduct
    })
});
//@ get all products
//@route get /api/products
//@access public
exports.getAllProducts= asyncHandler(async(req,res)=>{
     const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
     const sortBy = (req.query.sortBy || "newest").toString();
      const skip = (page - 1) * limit;
 
      const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        "name-asc": { name: 1 },
        "name-desc": { name: -1 },
      };
      const sort = sortMap[sortBy] || sortMap.newest;
 
         const products = await Product.find({ isInactive: false }).sort(sort).skip(skip).limit(limit);
         const total = await Product.countDocuments({ isInactive: false });
 
     res.status(200).json({
         status:"success",
         message:"products fetched successfully",
         products: Array.isArray(products) ? products : [],
         pagination: {
          total,
          page,
          limit,
          sortBy,
          hasMore: skip + products.length < total
        }
     })
})


//@update product
//@route get /api/product/update
//@access private

    exports.updateProduct= asyncHandler(async(req,res)=>{
    const user= await Seller.findById(req.userId);
    const updateData=req.body;
    const productId= req.params.id;
let product = redisClient.get(productId);
if(product){
    redisClient.del(productId);
}
     product = user.products.find(p => p.toString() === productId.toString());
   
    if(!product){
        throw new Error("you are the not authorize to update to this product");
    }
    if(req.file){
        const uploadedUrl = await uploadProductImage(req.file);
        if (uploadedUrl) {
            updateData.images=uploadedUrl;
        }
    }
   const updated = await Product.findByIdAndUpdate(productId,updateData,{returnDocument:"after"})
   
    res.status(200).json({
        status:"success",
        message:"products updated successfully",
        product:updated
    })
})

//@ delete product
// route delete /api/product/:id
// access private

exports.deleteProduct=asyncHandler(async(req,res)=>{
const productId= req.params.id;
let product = redisClient.get(productId);
if(product){
    redisClient.del(productId);
}
const sellerId= req.userId;
 product= await Product.findById(productId);
if (!product) {
    return res.status(404).json({
        status: "fail",
        message: "Product not found"
    });
}
const ownerId = product.seller?.toString();
if (!ownerId || sellerId !== ownerId) {
    return res.status(403).json({
        status: "fail",
        message: "you can only delete your product"
    });
}

// seller.products.filter(product=>product.toString()===productId.toString())

product.isInactive=true;
product.isAvailable=false;
await product.save();

res.status(201).json({
    status: "success",
    
    message: "product deleted successfuly",
    
})

})

//@ all selers listed prodects
//@route get /products/seller/listing
// access private

exports.sellerListing= asyncHandler(async (req,res)=>{
    const seller = await Seller.findById(req.userId);
    if (!seller) {
        throw new Error("Seller not found");
    }

    const listings = await Product.find({ seller: req.userId })
        .sort({ createdAt: -1 });

    res.status(200).json({
        status:"success",
        message:"seller listing",
        listings
    })
    
    
})

//@get product details by id
// @route get /products/:id
//acceses public
exports.productDetails= asyncHandler(async(req,res)=>{
  
  let product = await redisClient.get(req.params.id);
    if(!product){
     product=await Product.findById(req.params.id);
     if(product)
    await  redisClient.set(req.params.id,JSON.stringify(product),"EX",30*60);
    
    
    }else{
        product=JSON.parse(product);
    }
    
    
    if(!product){
        throw new Error ("product not found");
        
    }
    if(product.isInactive){
        throw new Error("product not found")
    }
    res.status(200).json({
        status:"success",
        message:"product detaisl fetched Successfuly",
        product
        
    })
    
    
})

// search query
// route get /products/search?q=keyword
// access public

exports.searchProducts= asyncHandler(async(req,res)=>{
     const query= req.query.q;
     const products= await Product.find(
     {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      
      ]
    }   )
    
    if(!products){
        throw new Error("no product found")
        
    }
    
    res.status(200).json({
        status:"success",
        message:"search results",
        products
    })
    
    
    
})