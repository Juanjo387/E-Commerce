import express from "express";
import {
	getDiscountOptions,
	getUserPoints,
	applyDiscount,
} from "../controllers/discountController.js";
import { requireSignIn } from "../middleware/access.js";

const router = express.Router();

// GET /api/discount/options - Lists all available discount options (public)
router.get("/options", getDiscountOptions);

// GET /api/discount/points - Shows the current points of the logged-in user (protected)
router.get("/points", requireSignIn, getUserPoints);

// POST /api/discount/apply - Applies a selected discount option (protected)
router.post("/apply", requireSignIn, applyDiscount);

export default router;


