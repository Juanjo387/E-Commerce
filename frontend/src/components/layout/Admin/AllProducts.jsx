import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "./AllProducts.css";
import { generateBaseURL } from "../../../utils.js";
import { useCurrency } from "../../../contexts/currencyContext";

function AllProducts() {
	const [products, setProducts] = useState([]);
	const navigate = useNavigate();
	const [isReordering, setIsReordering] = useState(false);
	const { convertPrice } = useCurrency();

	async function getProducts() {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/products`);

			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			const productsData = await response.json();
            setProducts(productsData); 
		} catch (error) {
			console.error("Error retrieving products:", error);
		}
	}

	const moveProduct = (index, direction) => {
		const newProducts = [];
		for (let i = 0; i < products.length; i++) {
			if (i === index) {
				newProducts.push(products[index + direction]); 
			} else if (i === index + direction) {
				newProducts.push(products[index]);
			} else {
				newProducts.push(products[i]);
			}
		}
		setProducts(newProducts);
	};

	const saveOrder = () => {
        localStorage.setItem("productOrder", JSON.parse(products));
        setIsReordering(false);
    };

	async function deleteProduct(productId) {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/products/${productId}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error(
					`Failed to delete product with ID ${productId}: ${response.statusText}`,
				);
			}

			const updatedProducts = products.filter(
				(product) => product._id !== productId,
			);
			setProducts(updatedProducts);
			toast.success("Product deleted successfully");
		} catch (error) {
			console.error(
				`Error deleting product with ID ${productId}:`,
				error,
			);
			toast.error("Failed to delete product");
		}
	}

	function editProduct(productId) {
		// Navigate to the form where the product can be edited
		navigate(`/dashboard/all-products/edit-product/${productId}`);
	}

	useEffect(() => {
		getProducts();
	}, []);

	return (
		<div className="all-products">
			<h1>All Products</h1>
			<div className="product-list-container">
				<ul className="product-list">
					{products.map((product, index) => ( 
						<li key={product._id} className="product-item">
							<span className="product-name">{product.name}</span>{" "}
							-{" "}
							<span className="product-price">
								$ {convertPrice(product.price)}
							</span>
							<div className="button-container">
								<button
									className="delete-button"
									onClick={() => deleteProduct(product._id)}
								>
									Delete
								</button>
								<button
									className="edit-button"
									onClick={() => editProduct(product._id)}
								>
									Edit
								</button>
							</div>
						{isReordering && (
                            <div > 
                                <button
									className="up-down-btn"
                                    onClick={() => moveProduct(index, -1)}
                                >
                                    Up
                                </button>
                                <button
									className="up-down-btn"
                                    onClick={() => moveProduct(index, 1)}
                                >
                                    Down
                                </button>
							</div>
                        )}
						</li>
					))}
				</ul>
			</div>
			{isReordering && <button className="save-btn" onClick={saveOrder}>Save Changes</button>}
			<div >
			<button className="reorder-btn" onClick={() => setIsReordering(true)}>  
                Reorder Products 
            </button>
			<button onClick={() => navigate("/dashboard/admin/create-product")}>
				Add New Product
			</button>
			</div>
		</div>
	);
}

export default AllProducts;
