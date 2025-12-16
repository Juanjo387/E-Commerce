import express from "express";
import {
	getAllOrders,
	createOrder,
	getUserOrders,
	updateOrderStatus,
	updateOrderTracking,
	exchangeProduct
} from "../controllers/orderController.js";

const router = express.Router();

// Routes
router.get("/", getAllOrders);
router.get("/:username", getUserOrders);
router.post("/", createOrder);
router.patch("/:orderId/status", updateOrderStatus);
router.patch("/:orderId/tracking", updateOrderTracking);
router.post("/exchange", exchangeProduct);

export default router;
