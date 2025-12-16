import JWT from "jsonwebtoken";
// import User from "../models/users.js";

// Protected Routes token base
export const requireSignIn = async (req, res, next) => {
	try {
		const decoded = JWT.verify(
			req.headers.authorization,
			process.env.TOKEN_KEY,
		);
		req.user = decoded;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).send({
			success: false,
			error,
			message: "Unauthorized Access",
		});
	}
};

// Admin access
export const isAdmin = async (req, res, next) => {
	try {
		console.log("Admin Role:", req.user.email);
		if (req.user.role !== "admin") {
			return res.status(401).send({
				success: false,
				message: "Unauthorized Access",
			});
		}

		next();
	} catch (error) {
		console.log(error);
		res.status(401).send({
			success: false,
			error,
			message: "Error in admin middleware",
		});
	}
};
