const globalErrorHandler=(error,req,res,next)=>{
	res.status(error?.statusCode || 500).json({status:"failed",
	message:error?.message||"somthing Went wrong",
		stack:error?.stack
	})
}
module.exports=globalErrorHandler;