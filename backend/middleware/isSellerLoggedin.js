const { verify } = require("jsonwebtoken");
const Seller=require("../models/Seller");
exports.isSellerLoggedin = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return next(new Error("token not found"));
	}

	if (!process.env.JWT_SECRET) {
		return next(new Error("JWT secret is not configured"));
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		if (decoded.role && decoded.role !== "seller") {
			const error = new Error("invalid seller session");
			error.statusCode = 403;
			return next(error);
		}
		req.userId = decoded.id;
		const seller = await Seller.findById(decoded.id).select("_id");
		if (!seller) {
			const error = new Error("seller not found");
			error.statusCode = 404;
			return next(error);
		}
		
		return next();
	} catch (error) {
		return next(new Error(error.message));
	}
};
