const asyncHandler = require("express-async-handler");

const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto = require('crypto');
const Seller = require("../models/Seller");
const sendEmail = require("../utils/passwordResetEmail");

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
	


	const token=jwt.sign({id:seller._id},process.env.JWT_SECRET,{ expiresIn: '10d' })

	res.status(200).json({
		status:"success",
		message:"Seller logid in success fully",
		user:{
			name:seller.name,
			token,
			avatar:seller.avatar,
			email:seller.email,
			address:seller.address,
			pincode:seller.pincode,
				role:"seller"
		}
	})



})

//  @Seller profile
//  @route GET /api/seller/auth/profile
//  @access private

exports.sellerProfile=asyncHandler(async(req,res)=>{

const id =req.userId;
const seller= await Seller.findById(id).select("-password");
if(!seller){
	throw new Error("Seller not found");
	
	}

	res.status(200).json({
		status:"success",
		message:"Seller profile fetched successfuly",
		seller:{
			...seller.toObject(),
			role:"seller"
		}
		
		
	})
})

//@update Seller profile
//@route PUT  /api/seller/auth/profile
//@access private

exports.updateProfile=asyncHandler(async(req,res)=>{

const updateUser= req.body;
	const id =  req.userId;
	console.log(id)
  const user = await Seller.findOne({_id:id});
   console.log(updateUser);
  if(!user){
	console.log(user)
	throw new Error("seller not found");

  }
  if (req.file && req.file.path) {
	updateUser.avatar = req.file.path;
  }
	const newUser= await Seller.findByIdAndUpdate(id,updateUser,{ new: true, runValidators: true }).select("-password");
  res.status(200).json({
	status:"success",
	message:"seller  profile updated",
	newUser
  })







})

//
// //  @user seller  profile
// //  @route GET /api/seller/auth/profile
// //  @access private
//
// exports.sellerProfile=asyncHandler(async(req,res)=>{
//
// const id =req.userId;
// const user= await Seller.findOne({_id:id}).select("-password");
// if(!user) {
// 	throw new Error("user not found");
//
// }
//
// 	res.status(200).json({
// 		status:"success",
// 		message:"user profile fetched successfully",
// 		user:{
// 			...user._doc,
// 			role:"seller"
// 		}
//
//
// 	})
// })

//forget password password
// route POST /api/auth/reset-password
// access private

exports.forgetPassword=asyncHandler(async(req,res)=>{
  const {email}= req.body;
  const sellerFound  = await Seller.findOne({email});
  if(!sellerFound){
	throw new Error("seller not found with this email");
  }
  const resetToken = await sellerFound.generatePasswordResetToken();
  console.log("Generated reset token:", resetToken);
  await sellerFound.save();
  await sendEmail(email, resetToken);
  res.json({
	status: "success",
	message: "password reset token sent to your email successfully"
  })
})
//@desc password reset
//@route PUT /api/v1/users/reset-password/:resetToken
//@access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	//Get the token form params

	const resetToken = req.params.token;
	// Get the password
	const {password} = req.body;
	//convert resetToken into hashed token
	const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	//verify the token with DB
	const tokenUser = await Seller.findOne({
		passwordResetToken: hashedToken,
		passwordResetExprires: {$gt: Date.now()}
	});
	//if user is not found
	
	if (!tokenUser) {
		const error = new Error("user not found or token is expired");
		next(error);
		return;
	}
	//UPDATE the new password
	let salt = await bcrypt.genSalt(10);
	let hash = await bcrypt.hash(password, salt);
	tokenUser.password = hash;
	tokenUser.passwordResetToken = undefined;
	tokenUser.passwordResetExprires = undefined;
	await tokenUser.save();
	res.json({
		status: "success",
		message: "Password reset  successfully",
	})
	
})
