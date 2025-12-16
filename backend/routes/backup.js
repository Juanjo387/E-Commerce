import express from "express";
import {
    getAllBackupProducts,
    getAllBackupOrders,
    addBackupProduct,
    addBackupOrder,
    updateBackupProduct,
    updateBackupOrder,
    deleteBackupProduct,
    deleteBackupOrder
} from "../controllers/backupController.js";
import { orderRateLimiter, productRateLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/products", getAllBackupProducts);
router.post("/products", productRateLimiter, addBackupProduct);
router.put("/products/:productId", productRateLimiter, updateBackupProduct);
router.delete("/products/:productId", productRateLimiter, deleteBackupProduct);

router.get("/orders", getAllBackupOrders);
router.post("/orders", orderRateLimiter, addBackupOrder);
router.put("/orders/:orderId", orderRateLimiter, updateBackupOrder);
router.delete("/orders/:orderId", orderRateLimiter, deleteBackupOrder);

export default router;
