import React, { createContext, useState, useEffect } from "react";
import { PRODUCTS, getProducts } from "../products.js";

export const ShopContext = createContext(0);

export const ShopContextProvider = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [cartItems, setCartItems] = useState({});

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				await getProducts();
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching products:", error);
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			setCartItems(getDefaultCart());
		}
	}, [isLoading]);

	useEffect(() => {
		localStorage.setItem("cartItems", JSON.stringify(cartItems));
	}, [cartItems]);

	const getDefaultCart = () => {
		let cart = {};
		if (PRODUCTS.length > 0) {
			PRODUCTS.forEach((product) => {
				cart[product.sNo] = 0;
			});
		}
		localStorage.setItem("cartItems", JSON.stringify(cart));
		return cart;
	};

	const getTotalCartAmount = () => {
		let totalAmount = 0;
		for (const item in cartItems) {
			if (cartItems[item] > 0) {
				let itemInfo = PRODUCTS.find(
					(product) => product.sNo === Number(item),
				);
				totalAmount += cartItems[item] * itemInfo.price;
			}
		}
		return totalAmount;
	};

	const addToCart = (itemId) => {
		setCartItems((prev) => {
			return { ...prev, [itemId]: prev[itemId] + 1 };
		});
	};

	const removeFromCart = (itemId) => {
		setCartItems((prev) => {
			const updatedItems = { ...prev };
			if (updatedItems[itemId] > 0) {
				updatedItems[itemId] -= 1;
			}
			return updatedItems;
		});
	};

	const updateCartItemCount = (newAmount, itemId) => {
		setCartItems((prev) => {
			return { ...prev, [itemId]: newAmount };
		});
	};

	const checkout = () => {
		setCartItems(getDefaultCart());
	};

	const contextValue = {
		cartItems,
		addToCart,
		updateCartItemCount,
		removeFromCart,
		getTotalCartAmount,
		checkout,
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<ShopContext.Provider value={contextValue}>
			{props.children}
		</ShopContext.Provider>
	);
};
