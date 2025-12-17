/* eslint-disable no-unused-vars */
import express from "express";
import cors from "cors";
import "express-async-errors";
import authRouter from "./routes/auth.js";
import testRouter from "./routes/test.js";
import postsRouter from "./routes/posts.js";
import dotenv from "dotenv";

import productRoutes from "./routes/product.js";
import ordersRoute from "./routes/orders.js";
import cartRouter from "./routes/cart.js";
import ratingsRoute from "./routes/ratings.js";
import inventoryRoute from "./routes/inventory.js";
import backupRoutes from "./routes/backup.js";
import quotaRoutes from "./routes/quotas.js";
import discountRoutes from "./routes/discount.js";
import reviewsRoutes from "./routes/reviews.js";

const PORT = process.env.PORT || 8080;
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

// Load the /posts routes
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoute);
app.use("/api/cart", cartRouter);
app.use("/api/ratings", ratingsRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/backup", backupRoutes);
app.use("/api/quotas", quotaRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/reviews", reviewsRoutes);

// Global error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || "Internal Server Error");
	// next() //uncomment this when actually using next()
});

app.use((req, res) => {
	res.send("Server is running!");
});

// start the Express server
app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});

export default app;
