import React, { useState, useEffect } from "react";
import { generateBaseURL } from "../../../utils";
import { useAuth } from "../../../contexts/onAuth";
import { useCurrency } from "../../../contexts/currencyContext";
import productImage from "./placeholder.jpeg";
import "./ExchangeProduct.css";

const ExchangeProduct = () => {
	const [purchasedProducts, setPurchasedProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [selectedPurchasedProduct, setSelectedPurchasedProduct] =
		useState("");
	const [selectedNewProduct, setSelectedNewProduct] = useState("");
	const { auth } = useAuth();
	const { convertPrice } = useCurrency();
	const product = "";

	useEffect(() => {
		fetchPurchasedProducts();
		fetchAllProducts();
	}, []);

	const fetchPurchasedProducts = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/orders/${auth.user.username}`,
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}
			const orders = await response.json();
			const products = orders.flatMap((order) => order.products);
			setPurchasedProducts(products);
		} catch (error) {
			console.error("Error retrieving purchased products:", error);
		}
	};

	const fetchAllProducts = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/products`);
			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}
			const products = await response.json();
			setAllProducts(products);
		} catch (error) {
			console.error("Error retrieving all products:", error);
		}
	};

	const handlePurchasedProductChange = (e) => {
		const productId = e.target.value;
		const product = purchasedProducts.find((p) => p._id === productId);
		setSelectedPurchasedProduct(product);
	};

	const handleNewProductChange = (e) => {
		const productId = e.target.value;
		const product = allProducts.find((p) => p._id === productId);
		setSelectedNewProduct(product);
	};

	return (
		<div className="exchange-product">
			<h1>Exchange Product</h1>
			<div className="exchange-container">
				<div className="exchange-column">
					<h2>Your Purchased Products</h2>
					<select
						data-testid="purchased-product-select"
						onChange={handlePurchasedProductChange}
						value={selectedPurchasedProduct._id || ""}
					>
						<option value="" disabled>
							Select a product
						</option>
						<option key={product._id} value={product._id}>
							{product.name}
						</option>
					</select>
					<div
						data-testid="purchased-product-box"
						className="product-box-content"
					>
						<img src={productImage} alt={purchasedProducts.name} />
						<p>
							<strong>Name:</strong> {purchasedProducts.name}
						</p>
						<p>
							<strong>Description:</strong>{" "}
							{purchasedProducts.description}
						</p>
						<p>
							<strong>Tags:</strong> {purchasedProducts.tags}
						</p>
						<p>
							<strong>Price:</strong> $
							{convertPrice(purchasedProducts.price)}
						</p>
					</div>
				</div>
				<div className="exchange-column">
					<h2>Available Products</h2>
					<select
						data-testid="available-product-select"
						onChange={handleNewProductChange}
						value={selectedNewProduct?._id || ""}
					>
						<option value="" disabled>
							Select a product
						</option>
						<option key={product._id} value={product._id}>
							{product.name}
						</option>
					</select>
					<div
						data-testid="available-product-box"
						className="product-box-content"
					>
						<img src={productImage} alt={allProducts.name} />
						<p>
							<strong>Name:</strong> {allProducts.name}
						</p>
						<p>
							<strong>Description:</strong>{" "}
							{allProducts.description}
						</p>
						<p>
							<strong>Tags:</strong> {allProducts.tags}
						</p>
						<p>
							<strong>Price:</strong> $
							{convertPrice(allProducts.price)}
						</p>
					</div>
				</div>
			</div>
			<button data-testid="exchange-btn" className="exchange-btn">
				Exchange Product
			</button>
		</div>
	);
};

export default ExchangeProduct;
