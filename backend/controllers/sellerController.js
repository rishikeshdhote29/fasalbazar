const asyncHandler = require("express-async-handler");

const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const Seller = require("../models/Seller");

//@Seller register
//@route POST /api/seller/auth/register
//@access public

exports.register = asyncHandler( async (req, res, next) => {
	

	const {name,email,password}= req.body;
	const seller= await Seller.findOne({email});
	if(seller){
		throw new Error("Seller already exist");
	}
	const salt= await bcrypt.genSalt(10);
	
	const hashedPassword= await bcrypt.hash(password,salt);
	const newSeller= await Seller.create({
		name,email,password:hashedPassword});
	res.status(201).json({
		success:true,
		message:"Seller register succesfuly",
		
	})
	
	
	
})

//@Seller Login
//@ route POST /api/seller/auth/login
//@access public

exports.loginSeller=asyncHandler(async(req,res)=>{
	
	const {email,password}=req.body;
	
	const seller= await Seller.findOne({email});
	if (!seller){
		throw new Error("invalid Creadtials");

	}
  const isMatch= await bcrypt.compare(password,seller.password);
	if (!isMatch){
		throw new Error("invalid Creadtials");

	}
	


	const token=jwt.sign({id:seller._id},process.env.JWT_SECRET,{ expiresIn: '1h' })

	res.status(200).json({
		status:"success",
		message:"Seller logid in success fully",
		user:{
			name:Seller.name,
			token,
			avatar:seller.avatar,
			email:seller.email,
			address:seller.address,
			pincode:seller.pincode,
			avatar:seller.avatar,
		}
	})



})

//  @Seller profile
//  @route GET /api/seller/auth/profile
//  @access private

exports.sellerProfile=asyncHandler(async(req,res)=>{

const id =req.userId;
const Seller= await Seller.findOne({_id:id}).select("-password");
if(!Seller){
	throw new Error("Seller not found");
	
	}

	res.status(200).json({
		status:"success",
		message:"Seller profile fetched successfuly",
		Seller
		
		
	})
})

//@update Seller profile
//@route PUT  /api/seller/auth/profile
//@access private

exports.updateProfile=asyncHandler(async(req,res)=>{
const updateSeller= req.body;
	const id =  req.userId;
  const Seller = await Seller.findOne({_id:id});
  
  if(!Seller){
	console.log(Seller)
	throw new Error("Seller not found");

  }

  const newSeller= await Seller.findByIdAndUpdate(id,updateSeller	,{returnDocument:"after"});
  res.status(200).json({
	status:"success",
	message:"Seller profile updated",
	newSeller
  })






})
