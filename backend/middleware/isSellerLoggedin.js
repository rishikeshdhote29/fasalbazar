const { verify } = require("jsonwebtoken");

exports.isSellerLoggedin = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return next(new Error("token not found"));
	}

	if (!process.env.JWT_SECRET) {
		return next(new Error("JWT secret is not configured"));
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id;
		return next();
	} catch (error) {
		return next(new Error(error.message));
	}
};
