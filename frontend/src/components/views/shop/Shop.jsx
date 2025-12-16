import React, { useEffect, useState } from "react";

import "./shop.css";
import { Product } from "./Product";
import { generateBaseURL } from "../../../utils";

export const Shop = ({ isSaleActive }) => {
	const [products, setProducts] = useState([]);
	const [showLiked, setShowLiked] = useState(false);
	const [countdown, setCountdown] = useState(5);

	async function getProducts() {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/products`);

			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			const productsData = await response.json();
			const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
			const productsWithLikedStatus = productsData.map(product => ({
				...product,
				liked: likedProducts.includes(product._id),
			}));
			setProducts(productsWithLikedStatus);

			let savedOrder = localStorage.getItem("productOrder");
			if (typeof savedOrder === "object") {
				savedOrder = JSON.parse(savedOrder); 
			} else {
				savedOrder = null;  
			}
			if (savedOrder) setProducts(savedOrder);
		} catch (error) {
			console.error("Error retrieving products:", error);
		}
	}

	useEffect(() => {
		getProducts();
	}, []);

	useEffect(() => {
		if (isSaleActive) {
			setCountdown(5); 
		} else {
			setCountdown(0);
		}
	}, [isSaleActive]);

	useEffect(() => {
		if (countdown > 0) {
			setTimeout(() => setCountdown(countdown - 1));
		} else {
			setCountdown(0);
		}
	}, [countdown]);

	const handleSortByLiked = () => {
		setShowLiked(!showLiked);
	};

	return (
		<div className="shop">
			{countdown ? (
				<div data-testid="sale-banner" className="sale-banner">Sale starting in {countdown} seconds</div>
			) : (
				isSaleActive && <div data-testid="sale-banner" className="sale-banner">Sale is ON!</div>
			)}
			<button className='filter-like-btn' onClick={handleSortByLiked}>
				{showLiked ? "Go to All Products" : "Filter by liked Products"}
			</button>
			<div className="shop__products">
				{products.map((product) => (
					<Product key={product._id} data={product} isSaleActive={isSaleActive} />
				))}
			</div>
		</div>
	);
};
