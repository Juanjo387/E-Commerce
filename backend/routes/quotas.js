import express from "express";
import { isAdmin, requireSignIn } from "../middleware/access.js";
import {
	getAllUsersWithQuotas,
	getUserQuotas,
	setUserQuotas,
	checkOrderQuota,
} from "../controllers/quotaController.js";

const router = express.Router();

// Admin routes (require admin authentication)
router.get("/users", requireSignIn, getAllUsersWithQuotas);
router.get("/users/:userId", requireSignIn, getUserQuotas);
router.put("/users/:userId", requireSignIn, setUserQuotas);

// User routes (require user authentication)
router.post("/check-order/:userId", requireSignIn, checkOrderQuota);

export default router;
