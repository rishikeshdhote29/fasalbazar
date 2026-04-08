const globalErrorHandler=(error,req,res,next)=>{
	res.status(500).json({status:"failed",
	message:error?.message||"somthing Went wrong",
		stack:error?.stack
	})
	next();
}
module.exports=globalErrorHandler;