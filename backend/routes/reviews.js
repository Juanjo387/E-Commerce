import express from "express";
import {
	createReview,
	updateReview,
	deleteReview,
	getUserReview,
	getAverageReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// POST /api/reviews - Create a new review
router.post("/", createReview);

// PUT /api/reviews - Update an existing review
router.put("/", updateReview);

// DELETE /api/reviews - Delete a review
router.delete("/", deleteReview);

// GET /api/reviews/user/:userId/product/:productId - Get user's review for a product
router.get("/user/:userId/product/:productId", getUserReview);

// GET /api/reviews/average/:productId - Get average review for a product
router.get("/average/:productId", getAverageReview);

export default router;


