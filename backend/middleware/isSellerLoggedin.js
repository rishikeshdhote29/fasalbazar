const {verify} = require("jsonwebtoken");
exports.isSellerLoggedin=(req,res,next)=>{
	const token=req.headers.authorization?.split(" ")[1];
	if (!token) {
	throw new Error( "token not found");

	}
	verify(token,process.env.JWT_SECRET,(error, decoded)=>{
		if(error){
			throw new Error(error.message);
			
		}
		req.userId=decoded.id;

		next();
		
	})
	
	
}