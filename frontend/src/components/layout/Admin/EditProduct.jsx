//react imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//internal imports
import "./EditProduct.css";
import { generateBaseURL } from "../../../utils.js";

const EditProductForm = () => {
	const { productId } = useParams(); // Retrieve the productId from the URL
	const navigate = useNavigate();
	const [product, setProduct] = useState({
		name: "",
		price: 0,
		description: "",
		tags: "",
	});

	useEffect(() => {
		getProduct(productId);
	}, [productId]);

	async function getProduct(productId) {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/products/${productId}`,
			);

			if (!response.ok) {
				throw new Error(
					`Error retrieving product with ID ${productId}`,
				);
			}

			const productData = await response.json();
			setProduct(productData);
		} catch (error) {
			console.error(error.message);
		}
	}

	async function updateProduct(e) {
		e.preventDefault();

		try {
			const baseURL = generateBaseURL();
			await fetch(`${baseURL}/api/products/${productId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(product),
			});

			console.log("Product updated successfully!");
			navigate("/dashboard/admin/all-products");
		} catch (error) {
			console.error(
				`Error updating product with ID ${productId}:`,
				error,
			);
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProduct((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<div className="edit-product-form">
			<h2>Edit Product</h2>
			<form onSubmit={updateProduct}>
				<div className="form-group">
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={product.name || ""}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="price">Price:</label>
					<input
						type="number"
						id="price"
						name="price"
						value={product.price || 0}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="description">Description:</label>
					<textarea
						id="description"
						name="description"
						value={product.description || ""}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="tags">Tags:</label>
					<input
						type="text"
						id="tags"
						name="tags"
						value={product.tags || ""}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit">Update Product</button>
			</form>
		</div>
	);
};

export default EditProductForm;
