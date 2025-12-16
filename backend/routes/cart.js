import express from "express";
const router = express.Router();
import {
	createCartItem,
	getCartItemsByUser,
	updateCartItem,
	deleteCartItem,
} from "../controllers/cartController.js";

router.post("/", createCartItem);
router.get("/:userId", getCartItemsByUser);
router.put("/:cartItemId", updateCartItem);
router.delete("/:cartItemId", deleteCartItem);

export default router;