const { verify } = require("jsonwebtoken");

exports.isLoggedin = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return next(new Error("token not found"));
	}

	if (!process.env.JWT_SECRET) {
	throw new Error( "token not found");
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id;
		return next();
	} catch (error) {
		return next(new Error(error.message));
	}
};
