import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
	res.send("Hello from the server!");
});

export default router;
