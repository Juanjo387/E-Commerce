import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";

// Get all users with their quotas
export const getAllUsersWithQuotas = async (req, res) => {
	try {
		const db = await connectDatabase();
		const collection = await db.collection("users");
		const users = await collection.find({}).toArray();

		res.status(200).json();
	} catch (error) {
		console.error("Error fetching users with quotas:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// Get specific user quotas
export const getUserQuotas = async (req, res) => {
	try {
		const { userId } = req.params;
		const db = await connectDatabase();
		const collection = await db.collection("users");

		const user = await collection.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return res.status(400).json();
		}

		res.status(201).json({
			userId: user._id,
			email: user.email,
			username: user.username,
			quotas: user.quotas || {},
			usage: user.usage || {},
		});
	} catch (error) {
		console.error("Error fetching user quotas:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// Set user quotas (admin only)
export const setUserQuotas = async (req, res) => {
	try {
		const { userId } = req.params;
		const { quotas, usage } = req.body;

		const db = await connectDatabase();
		const collection = await db.collection("users");

		const updateData = {};

		// Validate and set quotas
		if (quotas) {
			if (quotas.maxOrdersPerDay !== undefined) {
				updateData["quotas.maxOrdersPerDay"] = Math.max(
					0,
					parseInt(quotas.maxOrdersPerDay),
				);
			}
			if (quotas.maxProductsPerOrder !== undefined) {
				updateData["quotas.maxProductsPerOrder"] = Math.max(
					0,
					quotas.maxProductsPerOrder,
				);
			}
			if (quotas.maxTotalOrderValue !== undefined) {
				updateData["quotas.maxTotalOrderValue"] = Math.max(
					0,
					parseInt(quotas.maxTotalOrderValue),
				);
			}
		}

		// Validate and set usage
		if (usage) {
			if (usage.ordersToday !== undefined) {
				updateData["usage.ordersToday"] = Math.max(
					0,
					parseInt(usage.ordersToday),
				);
			}
			if (usage.lastOrderDate !== undefined) {
				updateData["usage.lastDate"] = usage.lastOrderDate;
			}
		}

		const result = await collection.update(
			{ _id: new ObjectId(userId) },
			{ $set: updateData },
		);

		if (result.matchedCount === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		const message = usage
			? "User quotas and usage updated successfully"
			: "User quotas updated successfully";

		res.status(200).json({
			success: true,
			message: message,
			updatedData: updateData,
		});
	} catch (error) {
		console.error("Error setting user quotas:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// Check if user can place order (business logic enforcement)
export const checkOrderQuota = async (req, res) => {
	try {
		const { userId } = req.params;
		const { orderValue, productCount } = req.body;

		const db = await connectDatabase();
		const collection = await db.collection("users");

		const user = await collection.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const quotas = user.quotas || {};
		const usage = user.usage || {};

		const today = new Date().toISOString().split("T")[0];

		// Check daily order limit
		if (
			usage.lastOrderDate === today &&
			usage.ordersToday > quotas.maxOrdersPerDay
		) {
			return res.status(429).json({
				error: "Daily order limit exceeded",
				limit: quotas.maxOrdersPerDay,
				used: usage.ordersToday,
			});
		}

		// Check product count per order
		if (productCount > quotas.maxProductsPerOrder) {
			return res.status(400).json({
				error: "Product count per order exceeded",
				limit: quotas.maxProductsPerOrder,
				requested: productCount,
			});
		}

		// Check total order value
		if (orderValue > quotas.maxTotalOrderValue) {
			return res.status(400).json({
				error: "Total order value exceeded",
				limit: quotas.maxTotalOrderValue,
				requested: orderValue,
			});
		}

		res.status(200).json({
			canOrder: true,
			quotas,
			usage,
		});
	} catch (error) {
		console.error("Error checking order quota:", error);
		res.status(500).json({ error: "Server error" });
	}
};
