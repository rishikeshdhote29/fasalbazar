const asyncHandler = require("express-async-handler");
const crypto = require('crypto');

const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/passwordResetEmail");
//@user register
//@route POST /api/auth/register
//@access public

exports.register = asyncHandler( async (req, res, next) => {
	
	console.log("register function called.......")
	const {name,email,password}= req.body;
	const user= await User.findOne({email});
	if(user){
		throw new Error("user already exist");
	}
	const salt= await bcrypt.genSalt(10);
	
	const hashedPassword= await bcrypt.hash(password,salt);
	const newUser= await User.create({
		name,email,password:hashedPassword});
	res.status(201).json({
		success:true,
		message:"user register succesfuly",
		
	})
	
	
	
})

//@user Login
//@ route POST /api/auth/login
//@access public

exports.loginUser=asyncHandler(async(req,res)=>{
	
	const {email,password}=req.body;
	
	const user= await User.findOne({email});
	if (!user){
		throw new Error("invalid Creadtials");

	}
  const isMatch= await bcrypt.compare(password,user.password);
	if (!isMatch){
		throw new Error("invalid Creadtials");

	}
	


	const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: '10d' })

	res.status(200).json({
		status:"success",
		message:"user logid in success fully",
		user:{
			name:user.name,
			token,
	 email:user.email,
			address:user.address,
			pincode:user.pincode,
			avatar:user.avatar,
			role:"user"
	}
	})


})

//  @user profile
//  @route GET /api/auth/profile
//  @access private

exports.userProfile=asyncHandler(async(req,res)=>{

const id =req.userId;
const user= await User.findOne({_id:id}).select("-password");
if(!user) {
	throw new Error("user not found");
	
}

	res.status(200).json({
		status:"success",
		message:"user profile fetched successfully",
		user:{
			...user._doc,
			role:"user"
		}
		
		
	})
})

//@update user profile
//@route PUT  /api/auth/profile
//@access private

exports.updateProfile=asyncHandler(async(req,res)=>{
const updateUser= req.body;
	const id =  req.userId;
  const user = await User.findOne({_id:id});
  
  if(!user){
	console.log(user)
	throw new Error("user not found");

  }
  if (req.file && req.file.path) {
	updateUser.avatar = req.file.path;
  }
  const newUser= await User.findByIdAndUpdate(id,updateUser	,{returnDocument:"after"});
  res.status(200).json({
	status:"success",
	message:"user profile updated",
	newUser
  })






})


//forget password password
// route POST /api/auth/reset-password
// access private

exports.forgetPassword=asyncHandler(async(req,res)=>{
const {email}= req.body;
const userFound  = await User.findOne({email});
if(!userFound){
	
	throw new Error("user not found with this email");
}
const resetToken = await userFound.generatePasswordResetToken();
	console.log("Generated reset token:", resetToken);
	await userFound.save();
	await sendEmail(email, resetToken);
	res.json({
		status: "success",
		message: "password reset token to your email succesfully"
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
	const tokenUser = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExprires: {$gt: Date.now()}
	}).select("-password");
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
