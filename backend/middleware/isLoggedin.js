const { verify } = require("jsonwebtoken");
const User = require("../models/User");

exports.isLoggedin = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	console.log( req.headers.authorization);
	if (!token) {
		return next(new Error("token not found"));
	}

	if (!process.env.JWT_SECRET) {
	throw new Error( "token not found");
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		if (decoded.role && decoded.role !== "user") {
			const error = new Error("invalid user session");
			error.statusCode = 403;
			return next(error);
		}
		req.userId = decoded.id;
		const user = await User.findById(decoded.id).select("_id");
		if (!user) {
			const error = new Error("user not found");
			error.statusCode = 404;
			return next(error);
		}
		return next();
	} catch (error) {
		return next(new Error(error.message));
	}
};
