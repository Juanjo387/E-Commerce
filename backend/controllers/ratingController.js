// import Rating from "../models/Rating";

import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";
const db = await connectDatabase();
const collection = db.collection("products");

export const createRating = async (req, res) => {
	try {
		const { userId, productId, ratingValue } = req.body;

		// Find the product in the collection
		const product = await collection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Update the ratings field with the new rating
		product.ratings = product.ratings || {};
		product.ratings[userId] = ratingValue;

		// Update the product in the collection
		await collection.updateOne(
			{ _id: new ObjectId(productId) },
			{ $set: { ratings: product.ratings } },
		);

		const insertedRating = {
			userId,
			productId,
			ratingValue,
		};

		res.status(201).json(insertedRating);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

// Controller for retrieving ratings for a specific product
export const getAverageProductRatings = async (req, res) => {
	try {
		const { productId } = req.params;

		// Find the product in the collection
		const product = await collection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Extract the ratings field from the product
		const ratings = product.ratings || {};

		// Calculate the average rating
		const ratingValues = Object.values(ratings);
		const ratedUsers = ratingValues.filter((value) => value > 0);
		const totalRatings = ratedUsers.length;
		const sumRatings = ratedUsers.reduce((a, b) => a + b, 0);
		const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

		// Round the average rating to one decimal place
		const roundedAverageRating = averageRating.toFixed(1);

		res.status(200).json({ ratings, averageRating: roundedAverageRating });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve ratings" });
	}
};

// Controller function to retrieve a specific user's rating for a specific product
export const getUserProductRating = async (req, res) => {
	try {
		const { userId, productId } = req.params;

		// Find the product in the collection
		const product = await collection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Extract the ratings field from the product
		const ratings = product.ratings || {};
		const userRating = ratings[userId] || 0;

		// Check if the user has purchased the product
		const hasPurchased = ratings[userId] !== undefined;

		if (!hasPurchased) {
			return res
				.status(403)
				.json({ error: "Please order the product to rate it" });
		}

		res.status(200).json({ userId, productId, ratingValue: userRating });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve user rating" });
	}
};
