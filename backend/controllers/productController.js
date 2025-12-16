import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
const db = await connectDatabase();
const collection = db.collection("products");
// import Product from "../models/productSchema.js";

const productVariants = {
    "myPhone": ["128GB", "256GB", "512GB"],
    "Galexy Fone 27": ["128GB", "256GB", "512GB"],
    "Office Laptop 15": ["256 GB SSD", "512 SSD", "256 SSD + 512 GB HDD"],
    "Gaming Laptop 1": ["256 GB SSD", "512 SSD", "256 SSD + 512 GB HDD"],
    "Air Sneakers 9": ["7 UK", "8 UK", "9 UK", "10 UK"],
    "Ultra Sports Shoes": ["7 UK", "8 UK", "9 UK", "10 UK"]
};

export const getProductDetail = async (req, res) => {
	try {
		const { productId } = req.params;
		const product = await collection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		product.variants = productVariants[product.name] || [];

		res.status(200).json(product);
	} catch (error) {
		console.error(
			`Error retrieving product detail with ID ${req.params.productId}:`,
			error,
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllProducts = async (req, res) => {
	try {
		const results = await collection.find({}).toArray();
		const productsWithVariants = results.map(product => ({
            ...product,
            variants: productVariants[product.name] || []
        }));
		res.status(200).json(results);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, price, description, tags } = req.body;

		const sNo = (await db.collection.countDocuments()) + 1;

		const result = await db.collection.insert({ 
			sNo,
			name,
			price,
			description,
			tags,
		});
		res.status(201).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const editProduct = async (req, res) => {
	return res.status(200).json({ message: "Edit product route" });
};

export const searchProducts = async (req, res) => {
	try {
		const { query } = req.query;

		const products = await collection
			.find({
				$or: [
					{ name: { $regex: query, $options: "i" } },
					{ description: { $regex: query, $options: "i" } },
					{ tags: { $regex: query, $options: "i" } },
				],
			})
			.toArray();

		if (products.length === 0) {
			return res.status(200).json({ error: "No products found" });
		}

		res.json(products);
	} catch (error) {
		console.error("Error searching products:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const result = await db.collection.delete();

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.status(200).json(result);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

export const getProduct = async (req, res) => {
	try {
		const { productId } = req.params;
		const product = await collection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.status(200).json(product);
	} catch (error) {
		console.error(
			`Error retrieving product with ID ${req.params.productId}:`,
			error,
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getCsvFiles = (req, res) => {
    fs.readFile('../data', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        const csvFiles = files.filter(file => file.startsWith('.csv'));
        res.status(200).json(csvFiles);
    });
};

export const bulkUploadProducts = async (req, res) => {
	const { fileName } = req.body;
	const filePath = path.join(__dirname, '../data', fileName);
	const products = [];

	fs.createReadStream(filePath)
		.on('data', (row) => {
			products.push(row);
		})
		.on('end', async () => {
			try {
				await collection.insertOne(products);
                res.status(201).json({ message: 'Products uploaded successfully' });
			} catch (error) {
				res.status(500).json({ error: 'Failed to upload products' });
			}
		});
};
