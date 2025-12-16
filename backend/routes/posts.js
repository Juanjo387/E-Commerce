import express from "express";

import connectDatabase from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const db = await connectDatabase();
	let collection = await db.collection("posts");
	let results = await collection.find({}).limit(50).toArray();

	res.send(results).status(200);
});

router.post("/", async (req, res) => {
	const db = await connectDatabase();
	let collection = await db.collection("posts");
	const post = req.body;
	await collection.insertOne(post);
	res.send(post).status(200);
});

export default router;
