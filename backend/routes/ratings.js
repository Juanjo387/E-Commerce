import express from "express";
import {
	createRating,
	getAverageProductRatings,
	getUserProductRating,
} from "../controllers/ratingController.js";

const router = express.Router();

// Route for creating a new rating
router.post("/", createRating);

// Route for retrieving a specific user's rating for a specific product
router.get("/user/:userId/product/:productId", getUserProductRating);

// Route for retrieving average product ratings
router.get("/average/:productId", getAverageProductRatings);

export default router;
