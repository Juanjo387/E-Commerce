// import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import User from "../models/users.js";
import connectDatabase from "../config/database.js";

export const registerController = async (req, res) => {
	try {
		const db = await connectDatabase();
		const collection = await db.collection("users");
		const { username, email, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = {
			username,
			email,
			password: hashedPassword,
			role: "user",
			discountPoints: 0, // Initialize discount points to 0
		};

		let results = await collection.find({ email: newUser.email }).toArray();
		if (results.length > 0) {
			console.log("User already exists");
			return res.status(400).send("User already exists");
		}

		const { insertedId } = await collection.insertOne(newUser);

		const token = jwt.sign(
			{ user_id: insertedId, email },
			process.env.TOKEN_KEY,
			{
				expiresIn: "2h",
			},
		);

		return res.status(200).send({
			token,
			role: newUser.role,
			username: newUser.username,
			email: newUser.email,
		});
	} catch (error) {
		console.log("Error occurred while registering user:", error);
		return res.status(500).send("Error occurred while registering user");
	}
};

//POST LOGIN
export const loginController = async (req, res) => {
	const db = await connectDatabase();
	const collection = await db.collection("users");
	const { email, password } = req.body;

	const user = await collection.findOne({ email });

	if (!user) {
		const errorMessage = "User does not exist";
		console.log(errorMessage);
		return res.status(400).send({ error: errorMessage });
	}

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
		const errorMessage = "Invalid password";
		console.log(errorMessage);
		return res.status(400).send({ error: errorMessage });
	}

	const token = jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.TOKEN_KEY,
		{ expiresIn: "2h" },
	);

	if (user.role !== "user") {
		const errorMessage = "Unauthorised: Access Denied";
		return res.status(400).send({ error: errorMessage });
	}

	return res.status(200).send({
		success: "Login Successful",
		token,
		user: {
			id: user._id,
			role: user.role,
			username: user.username,
			email: user.email,
		},
	});
};

// Token verification middleware
export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization;

	if (!token) {
		console.log("No token provided");
		return res.status(401).send("No token provided");
	}

	jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
		if (err) {
			console.log("Invalid token");
			return res.status(401).send("Invalid token");
		}

		req.user = decoded;
		next();
	});
};

//admin login controller
export const adminLoginController = async (req, res) => {
	try {
		const db = await connectDatabase();
		const collection = await db.collection("users");
		const { username, password } = req.body;

		// Check if the admin user exists
		const adminUser = await collection.findOne({ email:username, role: "admin" });
		if (!adminUser) {
			return res.status(401).json({ error: "Access restricted" });
		}

		// Validate the admin's password
		const isPasswordValid = await bcrypt.compare(
			password,
			adminUser.password,
		);

		if (!isPasswordValid) {
			console.log(password);
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate admin-specific authentication token
		const token = jwt.sign(
			{ id: adminUser._id, email: adminUser.email, role: adminUser.role },
			process.env.TOKEN_KEY,
			{ expiresIn: "2h" },
		);

		return res
			.send({
				success: "Login Successful",
				token,
				user: {
					role: adminUser.role,
					username: adminUser.username,
					email: adminUser.email,
				},
			})
			.status(200);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

//test controller
export const testController = (req, res) => {
	try {
		res.send("Protected Routes");
	} catch (error) {
		console.log(error);
		res.send({ error });
	}
};

export const getUserProfile = async (req, res) => {
    try {
        const db = await connectDatabase();
        const collection = await db.collection("users");
        const { emailId } = req.params;

        const user = await collection.findOne({ email: emailId });
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    const db = await connectDatabase();
    const { username, phone, address, dob } = req.body;

	const formattedDob = dob.split("-").reverse().join("-");
    const updateResult = await db.update(
        { username },
        { $set: { username, phone, address, dob: formattedDob } }
    );

    return res.status(200).send({ message: "Profile updated successfully" });
};
