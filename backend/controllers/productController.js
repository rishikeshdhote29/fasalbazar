const asyncHandler = require("express-async-handler");
const Seller = require("../models/Seller");

const Product = require("../models/Product");

exports.createProduct = asyncHandler(async (req, res) => {
  
    const product = req.body;
    product.seller = req.userId;
    
    // ✅ STOCK VALIDATION: Ensure valid quantity
    if (!product.quantity || product.quantity <= 0) {
        return res.status(400).json({
            status: "fail",
            message: "Product quantity must be greater than 0"
        });
    }

    if (req.file && req.file.path) {
        product.images = req.file.path;
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

    const product = user.products.find(p => p.toString() === productId.toString());
    console.log(product)
    if(!product){
        throw new Error("you are the not authorize to update to this product");
    }
    if(req.file&&req.file.path){
        updateData.images=req.file.path
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
const sellerId= req.userId;
const  product= await Product.findOne({_id:productId});
if (sellerId !== product?.seller?._id?.toString()) {
    throw new Error("you can only delete you product")
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
    
    const seller= await Seller.findById(req.userId).populate("products").sort({createdAt:-1});
    res.status(200).json({
        status:"success",
        message:"seller listing",
        listings:seller.products
    })
    
    
})

//@get product details by id
// @route get /products/:id
//acceses public
exports.productDetails= asyncHandler(async(req,res)=>{
    
    console.log(req.params.id)
    const product=await Product.findById(req.params.id);
    
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