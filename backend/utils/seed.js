import bcrypt from "bcrypt";
import connectDatabase from "../config/database.js";
import products from "../data/products.js";

async function seed() {
	try {
		const db = await connectDatabase();
		const usersCollection = db.collection("users");
		const productsCollection = db.collection("products");
		const ordersCollection = db.collection("orders");
		const inventoryCollection = db.collection("inventory");
		const userCollectionExists = await db
			.listCollections({ name: "users" })
			.hasNext();
		console.log("Connected to the database");

		// Drop the users collection
		if (userCollectionExists) {
			await usersCollection.drop();
			console.log("Dropped users collection");
		}

		// Create a new admin user
		const salt = await bcrypt.genSalt(10);
		const password = "admin123";
		const hashedPassword = await bcrypt.hash(password, salt);
		const adminData = {
			username: "admin",
			password: hashedPassword,
			email: "admin@mail.com",
			role: "admin",
			// Default quotas for admin
			quotas: {
				maxOrdersPerDay: 10,
				maxProductsPerOrder: 50,
				maxTotalOrderValue: 10000,
			},
			// Usage tracking
			usage: {
				ordersToday: 0,
				lastOrderDate: null,
			},
		};
		// Insert the admin user
		await usersCollection.insertOne(adminData);
		console.log("Admin user seeded successfully");

		// Create a new user
		const userpassword = "user123";
		const hashedUserPassword = await bcrypt.hash(userpassword, salt);
		const userpassword2 = "user1234";
		const hashedUserPassword2 = await bcrypt.hash(userpassword2, salt);
		const userData = {
			username: "user",
			password: hashedUserPassword,
			email: "user@mail.com",
			role: "user",
			// Default quotas for user
			quotas: {
				maxOrdersPerDay: 10,
				maxProductsPerOrder: 50,
				maxTotalOrderValue: 10000,
			},
			// Usage tracking
			usage: {
				ordersToday: 0,
				lastOrderDate: null,
			},
		};
		const userData2 = {
			username: "user2",
			password: hashedUserPassword2,
			email: "user2@mail.com",
			role: "user",
			// Default quotas for user2
			quotas: {
				maxOrdersPerDay: 10,
				maxProductsPerOrder: 50,
				maxTotalOrderValue: 10000,
			},
			// Usage tracking
			usage: {
				ordersToday: 0,
				lastOrderDate: null,
			},
		};
		// Insert the  user
		await usersCollection.insertOne(userData);
		await usersCollection.insertOne(userData2);
		console.log("user seeded successfully");

		// Check if the products collection exists before dropping
		const productsCollectionExists = await db
			.listCollections({ name: "products" })
			.hasNext();
		if (productsCollectionExists) {
			await productsCollection.drop();
			console.log("Dropped products collection");
		}
		// Check if the orders collection exists before dropping
		const ordersCollectionExists = await db
			.listCollections({ name: "orders" })
			.hasNext();
		if (ordersCollectionExists) {
			await ordersCollection.drop();
			console.log("Dropped orders collection");
		}
		// Insert the products
		await productsCollection.insertMany(products);
		console.log("Products seeded successfully");

		const invProducts = await productsCollection.find({}).toArray();
		for (const product of invProducts) {
			await inventoryCollection.insertOne({
				productName: product.name,
				productId: product._id,
				quantity: 1,
			});
		}
		console.log("Inventory seeded successfully");

		console.log("Data seeding completed");
	} catch (error) {
		console.error("Error seeding data:", error);
	} finally {
		process.exit(0);
	}
}
seed().catch((error) => {
	console.error("Error in seed script:", error);
	process.exit(1);
});
