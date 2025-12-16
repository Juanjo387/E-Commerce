import express from "express";
import connectDatabase from "../config/database.js";
import { isAdmin, requireSignIn } from "../middleware/access.js";
import {
	loginController,
	registerController,
	adminLoginController,
	getUserProfile,
	updateUserProfile
} from "../controllers/authController.js";
import {
  initiatePasswordReset,
  verifyResetOTP,
  updatePassword,
} from "../controllers/passwordResetController.js";

const router = express.Router();

// create new user
router.post("/register", registerController);

// login user
router.post("/login", loginController);

// Admin login
router.post("/admin-login", adminLoginController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
	res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
	res.status(200).send({ ok: true });
});

router.get("/", async (req, res) => {
	let db = await connectDatabase();
	let collection = await db.collection("users");
	let results = await collection.find({}).limit(50).toArray();
	res.send(results).status(200);
});

router.post("/initiate", initiatePasswordReset);

router.post("/verify", verifyResetOTP);

router.post("/update", updatePassword);

router.get("/profile/:emailId", getUserProfile);

router.put("/profile", updateUserProfile);

export default router;
