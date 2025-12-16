import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";

const db = await connectDatabase();
const cartCollection = db.collection("cart");
const productCollection = db.collection("products");

// Create a cart item
export const createCartItem = async (req, res) => {
	try {
		const { userId, productId, quantity } = req.body;
		// Check if the product exists
		const product = await productCollection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Check if the user already has this product in their cart
		const existingCartItem = await cartCollection.findOne({
			userId,
			productId,
		});

		if (existingCartItem) {
			// If the item already exists in the cart, update the quantity
			await cartCollection.updateOne(
				{ userId, productId },
				{ $inc: { quantity } }, // Increment the quantity
			);
		} else {
			// If the item is not in the cart, create a new cart item
			await cartCollection.insertOne({
				userId,
				productId,
				quantity,
			});
		}

		res.status(201).json({
			message: "Cart item added/updated successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

// Get cart items for a user
export const getCartItemsByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const cartItems = await cartCollection.find({ userId }).toArray();

		// Calculate the total price of items in the cart
		let totalPrice = 0;

		for (const cartItem of cartItems) {
			const product = await productCollection.findOne({
				_id: new ObjectId(cartItem.productId),
			});

			if (product) {
				totalPrice += product.price * cartItem.quantity;
				cartItem.product = product; // Add product details to the cart item
			}
		}

		res.status(200).json({ cartItems, totalPrice });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

// Update a cart item
export const updateCartItem = async (req, res) => {
	try {
		const { cartItemId } = req.params;
		const { quantity } = req.body;
		const result = await cartCollection.updateOne(
			{ _id: new ObjectId(cartItemId) },
			{ $set: { quantity } },
		);
		console.log("result", result);
		res.status(200).json({ message: "Cart item updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

// Delete a cart item
export const deleteCartItem = async (req, res) => {
	try {
		const { cartItemId } = req.params;

		await cartCollection.deleteOne({ _id: new ObjectId(cartItemId) });

		res.status(200).json({ message: "Cart item deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};