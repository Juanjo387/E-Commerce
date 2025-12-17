import connectDatabase from "../config/database.js";
import Order from "../models/orders.js";
import { ObjectId } from "mongodb";

// Controller actions
export const getAllOrders = async (req, res) => {
	try {
		const db = await connectDatabase();
		const collection = db.collection("orders");
		const results = await collection.find({}).toArray();
		res.status(200).json(results);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const getUserOrders = async (req, res) => {
	try {
		const { username } = req.params;
		const db = await connectDatabase();
		const collection = db.collection("orders");
		const results = await collection.find({ username }).toArray();
		res.status(200).json(results);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const createOrder = async (req, res) => {
	try {
		const db = await connectDatabase();
		const orderCollection = db.collection("orders");
		const userCollection = db.collection("users");
		const { username, totalAmount, products, address, payment } = req.body;

		// Get user ID for quota checking
		const user = await userCollection.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check quotas before creating order
		const quotas = user.quotas || {};
		const usage = user.usage || {};

		const today = new Date().toISOString().split('T')[0];

		// Check daily order limit
		if (usage.lastOrderDate === today && usage.ordersToday >= quotas.maxOrdersPerDay) {
			return res.status(429).json({ 
				error: "Daily order limit exceeded",
				limit: quotas.maxOrdersPerDay,
				used: usage.ordersToday
			});
		}

		// Check product count per order
		if (products.length > quotas.maxProductsPerOrder) {
			return res.status(400).json({ 
				error: "Product count per order exceeded",
				limit: quotas.maxProductsPerOrder,
				requested: products.length
			});
		}

		// Check total order value
		if (totalAmount > quotas.maxTotalOrderValue) {
			return res.status(400).json({ 
				error: "Total order value exceeded",
				limit: quotas.maxTotalOrderValue,
				requested: totalAmount
			});
		}

		products.map((product) => ({
			updateOne: {
				filter: { productName: product.name },
				update: { $inc: { quantity: -1 } },
			},
		}));

		const insertedOrder = await orderCollection.insertOne({
			username,
			totalAmount,
			products,
			address,
			payment,
			variant: req.body.variant 
		});

		// Update user usage after successful order creation
		const updateData = {
			"usage.lastOrderDate": today
		};

		// Increment daily orders if it's the same day, otherwise reset to 1
		if (usage.lastOrderDate === today) {
			updateData["usage.ordersToday"] = (usage.ordersToday || 0) + 1;
		} else {
			updateData["usage.ordersToday"] = 1;
		}

		// Calculate discount points earned: 1 point per $40 spent, rounded down
		const pointsEarned = Math.floor(totalAmount / 40);
		
		// Update user usage and discount points after successful order creation
		const currentPoints = user.discountPoints || 0;
		updateData["discountPoints"] = currentPoints + pointsEarned;

		await userCollection.updateOne(
			{ _id: user._id },
			{ $set: updateData }
		);

		const order = await orderCollection.findOne({
			_id: insertedOrder.insertedId,
		});
		res.status(201).json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const exchangeProduct = async (req, res) => {
    try {
        const { username, oldProductId, newProductId, priceDifference, payment } = req.body;
        const db = await connectDatabase();
        const orderCollection = db.collection("orders");
        const productCollection = db.collection("products");

        const order = await orderCollection.findOne({ username, "products.id": oldProductId });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const newProduct = await productCollection.findOne({ _id: new ObjectId(newProductId) });
        if (!newProduct) {
            return res.status(404).json({ error: "New product not found" });
        }

        const updatedProducts = order.products.map(product =>
            product.id === oldProductId ? { ...newProduct, isExchanged: true, extraPaid: priceDifference } : product
        );

        const updatedTotalAmount = order.totalAmount + priceDifference;

        await orderCollection.updateOne(
            { _id: order._id },
            { 
                $set: { 
                    products: updatedProducts,
                    totalAmount: updatedTotalAmount,
                    payment: payment 
                } 
            }
        );

        res.status(200).json({ message: "Product exchanged successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;
		const order = await Order.findByIdAndUpdate(
			orderId,
			{ status }, 
			{ new: true }
		);
		if (!order) return res.status(404).json({ error: "Order not found" });
		res.status(200).json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const updateOrderTracking = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { trackingNumber, shippingCarrier } = req.body;
		const order = await Order.findById(orderId);
		if (!order) return res.status(404).json({ error: "Order not found" });
		
		await new Promise(resolve => setTimeout(resolve, 1000));

		order.trackingNumber = trackingNumber;
		order.shippingCarrier = shippingCarrier;
		await order.save();
		
		res.status(200).json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};
