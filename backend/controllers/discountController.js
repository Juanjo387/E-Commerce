import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";

// Discount options mapping
const DISCOUNT_OPTIONS = [
	{ points: 20, discount: 10 },
	{ points: 40, discount: 15 },
	{ points: 60, discount: 20 },
	{ points: 80, discount: 25 },
];

// GET /api/discount/options - Lists all available discount options
export const getDiscountOptions = async (req, res) => {
	try {
		return res.status(200).json(DISCOUNT_OPTIONS);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Server error" });
	}
};

// GET /api/discount/points - Shows the current points of the logged-in user
export const getUserPoints = async (req, res) => {
	try {
		const db = await connectDatabase();
		const userCollection = db.collection("users");
		
		// Get user from token (set by requireSignIn middleware)
		const userId = req.user.id;
		
		// Convert to ObjectId if it's a string
		const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
		const user = await userCollection.findOne({ _id: userObjectId });
		
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Return points, defaulting to 0 if not set
		const points = user.discountPoints || 0;
		
		return res.status(200).json({ points });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Server error" });
	}
};

// POST /api/discount/apply - Applies a selected discount option to the user's current cart
export const applyDiscount = async (req, res) => {
	try {
		const db = await connectDatabase();
		const userCollection = db.collection("users");
		
		// Get user from token (set by requireSignIn middleware)
		const userId = req.user.id;
		const { discount } = req.body;

		if (!discount) {
			return res.status(400).json({ error: "Discount value is required" });
		}

		// Find the discount option that matches the requested discount percentage
		const discountOption = DISCOUNT_OPTIONS.find(
			(option) => option.discount === discount
		);

		if (!discountOption) {
			return res.status(400).json({ error: "Invalid discount option" });
		}

		// Get user's current points
		// Convert to ObjectId if it's a string
		const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
		const user = await userCollection.findOne({ _id: userObjectId });
		
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const currentPoints = user.discountPoints || 0;

		// Check if user has enough points
		if (currentPoints < discountOption.points) {
			return res.status(400).json({ error: "Not enough discount points" });
		}

		// Deduct points
		const updatedPoints = currentPoints - discountOption.points;

		// Update user's points in database
		await userCollection.updateOne(
			{ _id: userObjectId },
			{ $set: { discountPoints: updatedPoints } }
		);

		return res.status(200).json({
			discount: discountOption.discount,
			updatedPoints,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Server error" });
	}
};

