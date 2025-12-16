import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// internal imports
import "./Product.css";
import { generateBaseURL } from "../../../utils.js";

function Product() {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState("");
	const [sNo, setSNo] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch the next available SNo for the product
		getNextSNo();
	}, []);

	const getNextSNo = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/products`);

			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			const nextSNo = await response.json();
			setSNo(nextSNo);
		} catch (error) {
			console.error(error);
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/products`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					sNo,
					name,
					price,
					description,
					tags,
				}),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to submit data: ${response.statusText}`,
				);
			}

			const responseData = await response.json();
			console.log(responseData);

			// Clear the form after successful submission
			setName("");
			setPrice("");
			setDescription("");
			setTags("");
			toast.success("Product added successfully");
			navigate("/dashboard/admin/all-products");
		} catch (error) {
			console.error(error);
			toast.error("Product not added");
		}
	};

	return (
		<div className="Product">
			<h1>Create Product</h1>
			<form onSubmit={handleFormSubmit}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Price:</label>
					<input
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Description:</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					></textarea>
				</div>
				<div>
					<label>Tags:</label>
					<input
						type="text"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Create</button>
			</form>
		</div>
	);
}

export default Product;
