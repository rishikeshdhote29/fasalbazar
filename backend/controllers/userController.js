const asyncHandler = require("express-async-handler");

const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/User");
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
	}
	})


})

//  @user profile
//  @route GET /api/auth/profile
//  @access private

exports.userProfile=asyncHandler(async(req,res)=>{

const id =req.userId;
const user= await User.findOne({_id:id}).select("-password");
if(!user){
	throw new Error("user not found");
	
	}

	res.status(200).json({
		status:"success",
		message:"user profile fetched successfuly",
		user
		
		
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

  const newUser= await User.findByIdAndUpdate(id,updateUser	,{returnDocument:"after"});
  res.status(200).json({
	status:"success",
	message:"user profile updated",
	newUser
  })






})
