import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";

// Option to numeric mapping for average calculation
const OPTION_TO_NUMBER = {
	worst: 1,
	"not good": 2,
	average: 3,
	good: 4,
	great: 5,
};

// Number to option mapping for average result
const NUMBER_TO_OPTION = {
	1: "worst",
	2: "not good",
	3: "average",
	4: "good",
	5: "great",
};

// Valid options
const VALID_OPTIONS = ["worst", "not good", "average", "good", "great"];

// Rate limiting storage (in-memory, could be moved to Redis in production)
const updateRateLimits = new Map(); // userId -> { count: number, resetTime: number }

// Helper function to check if user purchased a product
const hasUserPurchasedProduct = async (userId, productId, username) => {
	try {
		const db = await connectDatabase();
		const orderCollection = db.collection("orders");
		const userCollection = db.collection("users");

		// Get user by userId to get username if needed
		let user = null;
		if (userId) {
			const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
			user = await userCollection.findOne({ _id: userObjectId });
		}

		const searchUsername = username || (user ? user.username : null);
		if (!searchUsername) {
			return false;
		}

		// Convert productId to ObjectId if it's a string
		const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

		// Find orders for this user
		const orders = await orderCollection.find({ username: searchUsername }).toArray();

		// Check if any order contains this product
		for (const order of orders) {
			if (order.products && Array.isArray(order.products)) {
				for (const product of order.products) {
					// Handle different product ID field names and formats
					let productIdToCheck = null;
					
					// Check for _id (ObjectId or string)
					if (product._id) {
						productIdToCheck = product._id;
					}
					// Check for id (string or ObjectId)
					else if (product.id) {
						productIdToCheck = product.id;
					}
					// Check for productId (ObjectId or string)
					else if (product.productId) {
						productIdToCheck = product.productId;
					}

					if (productIdToCheck) {
						// Normalize both IDs to strings for comparison
						let productIdStr = null;
						let targetIdStr = productObjectId.toString();

						// Handle different types of productIdToCheck
						if (productIdToCheck instanceof ObjectId) {
							productIdStr = productIdToCheck.toString();
						} else if (typeof productIdToCheck === 'string') {
							// Try to convert string to ObjectId and back for normalization
							try {
								const normalizedId = new ObjectId(productIdToCheck);
								productIdStr = normalizedId.toString();
							} catch (e) {
								// If it's not a valid ObjectId string, use as-is
								productIdStr = productIdToCheck;
							}
						} else {
							productIdStr = productIdToCheck.toString();
						}

						// Compare normalized strings
						if (productIdStr === targetIdStr) {
							return true;
						}
					}
				}
			}
		}

		return false;
	} catch (error) {
		console.error("Error checking purchase:", error);
		return false;
	}
};

// Helper function to check rate limit for updates
const checkUpdateRateLimit = (userId) => {
	const now = Date.now();
	const userLimit = updateRateLimits.get(userId);

	if (!userLimit) {
		// First update, set limit
		updateRateLimits.set(userId, { count: 1, resetTime: now + 60000 }); // 60 seconds
		return true;
	}

	// Check if reset time has passed
	if (now > userLimit.resetTime) {
		// Reset limit
		updateRateLimits.set(userId, { count: 1, resetTime: now + 60000 });
		return true;
	}

	// Check if limit exceeded
	if (userLimit.count >= 2) {
		return false;
	}

	// Increment count
	userLimit.count++;
	updateRateLimits.set(userId, userLimit);
	return true;
};

// POST /api/reviews - Create a new review
export const createReview = async (req, res) => {
	try {
		const db = await connectDatabase();
		const reviewCollection = db.collection("reviews");
		const { userId, username, productId, comment, option, photo } = req.body;

		// Validate required fields
		if (!userId || !username || !productId || !comment || !option) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Validate option
		if (!VALID_OPTIONS.includes(option)) {
			return res.status(400).json({ error: "Invalid option. Must be one of: worst, not good, average, good, great" });
		}

		// Check if user purchased the product
		const hasPurchased = await hasUserPurchasedProduct(userId, productId, username);
		if (!hasPurchased) {
			return res.status(403).json({ error: "User has not purchased this product" });
		}

		// Check if review already exists
		const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
		const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

		const existingReview = await reviewCollection.findOne({
			userId: userObjectId,
			productId: productObjectId,
		});

		if (existingReview) {
			return res.status(400).json({ error: "Review already exists" });
		}

		// Create review
		const review = {
			userId: userObjectId,
			username,
			productId: productObjectId,
			comment,
			option,
			photo: photo || null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await reviewCollection.insertOne(review);

		// Return review without MongoDB internal fields
		const createdReview = await reviewCollection.findOne({ _id: result.insertedId });
		const responseReview = {
			userId: createdReview.userId.toString(),
			productId: createdReview.productId.toString(),
			comment: createdReview.comment,
			option: createdReview.option,
			photo: createdReview.photo,
		};

		return res.status(201).json(responseReview);
	} catch (error) {
		console.error("Error creating review:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

// PUT /api/reviews - Update an existing review
export const updateReview = async (req, res) => {
	try {
		const db = await connectDatabase();
		const reviewCollection = db.collection("reviews");
		const { userId, productId, comment, option, photo } = req.body;

		// Validate required fields
		if (!userId || !productId || !comment || !option) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Validate option
		if (!VALID_OPTIONS.includes(option)) {
			return res.status(400).json({ error: "Invalid option. Must be one of: worst, not good, average, good, great" });
		}

		// Check rate limit
		const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
		if (!checkUpdateRateLimit(userId)) {
			return res.status(429).json({ message: "Too many updates, please try again later." });
		}

		// Find existing review
		const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;
		const existingReview = await reviewCollection.findOne({
			userId: userObjectId,
			productId: productObjectId,
		});

		if (!existingReview) {
			return res.status(404).json({ error: "Review not found" });
		}

		// Update review
		const updateData = {
			comment,
			option,
			photo: photo !== undefined ? photo : existingReview.photo,
			updatedAt: new Date(),
		};

		await reviewCollection.updateOne(
			{ _id: existingReview._id },
			{ $set: updateData }
		);

		// Return updated review
		const updatedReview = await reviewCollection.findOne({ _id: existingReview._id });
		const responseReview = {
			userId: updatedReview.userId.toString(),
			productId: updatedReview.productId.toString(),
			comment: updatedReview.comment,
			option: updatedReview.option,
			photo: updatedReview.photo,
		};

		return res.status(200).json(responseReview);
	} catch (error) {
		console.error("Error updating review:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

// DELETE /api/reviews - Delete a review
export const deleteReview = async (req, res) => {
	try {
		const db = await connectDatabase();
		const reviewCollection = db.collection("reviews");
		const { userId, productId } = req.body;

		// Validate required fields
		if (!userId || !productId) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
		const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

		// Find and delete review
		const result = await reviewCollection.deleteOne({
			userId: userObjectId,
			productId: productObjectId,
		});

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: "Review not found" });
		}

		return res.status(200).json({ message: "Review deleted successfully" });
	} catch (error) {
		console.error("Error deleting review:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

// GET /api/reviews/user/:userId/product/:productId - Get user's review for a product
export const getUserReview = async (req, res) => {
	try {
		const db = await connectDatabase();
		const reviewCollection = db.collection("reviews");
		const { userId, productId } = req.params;

		if (!userId || !productId) {
			return res.status(400).json({ error: "Missing required parameters" });
		}

		const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
		const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

		const review = await reviewCollection.findOne({
			userId: userObjectId,
			productId: productObjectId,
		});

		if (!review) {
			return res.status(404).json({ error: "Review not found" });
		}

		const responseReview = {
			userId: review.userId.toString(),
			productId: review.productId.toString(),
			comment: review.comment,
			option: review.option,
			photo: review.photo || undefined,
		};

		return res.status(200).json(responseReview);
	} catch (error) {
		console.error("Error fetching user review:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

// GET /api/reviews/average/:productId - Get average review for a product
export const getAverageReview = async (req, res) => {
	try {
		const db = await connectDatabase();
		const reviewCollection = db.collection("reviews");
		const { productId } = req.params;

		if (!productId) {
			return res.status(400).json({ error: "Missing productId parameter" });
		}

		const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

		// Get all reviews for this product
		const reviews = await reviewCollection.find({ productId: productObjectId }).toArray();

		if (reviews.length === 0) {
			return res.status(200).json({ averageReview: "not rated yet" });
		}

		// Calculate average
		let sum = 0;
		for (const review of reviews) {
			const numericValue = OPTION_TO_NUMBER[review.option];
			if (numericValue) {
				sum += numericValue;
			}
		}

		const average = Math.round(sum / reviews.length);
		const averageOption = NUMBER_TO_OPTION[average] || "average";

		return res.status(200).json({ averageReview: averageOption });
	} catch (error) {
		console.error("Error calculating average review:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

