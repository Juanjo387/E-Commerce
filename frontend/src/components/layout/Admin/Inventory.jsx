import React, { useEffect, useState } from "react";
import { generateBaseURL } from "../../../utils.js";
import "./Inventory.css";
import toast from "react-hot-toast";

function Inventory() {
	const [inventory, setInventory] = useState([]);
	const [updatedInventory, setUpdatedInventory] = useState([]);

	const fetchInventory = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/inventory/all`);
			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}
			const inventoryData = await response.json();
			setInventory(inventoryData);
		} catch (error) {
			console.error("Error retrieving inventory:", error);
		}
	};

	const updateInventory = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/inventory/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ inventory: updatedInventory }),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error);
			}
			const updatedData = await response.json();
			toast.success("Inventory updated successfully");
			setInventory(updatedData);
		} catch (error) {
			console.error("Error updating inventory:", error);
			toast.error(error.message);
		}
	};

	const handleInventoryChange = (productId, productName, quantity) => {
		setUpdatedInventory((prevInventory) => {
			const updatedItemIndex = prevInventory.findIndex(
				(item) => item.productId === productId,
			);
			if (updatedItemIndex !== -1) {
				return prevInventory.map((item) =>
					item.productId === productId ? { ...item, quantity } : item,
				);
			} else {
				return [...prevInventory, { productId, productName, quantity }];
			}
		});
	};

	useEffect(() => {
		fetchInventory();
	}, []);

	return (
		<div className="inventory">
			<h1>Inventory Management</h1>
			<div className="inventory-list">
				{inventory.length === 0 ? (
					<p className="no-product">No products available</p>
				) : (
					inventory.map((item) => (
						<div key={item.productId} className="inventory-item">
							<p>{item.productName} </p>
							<p>Stock:{item.quantity}</p>
							<input
								placeholder="Updated Stock"
								value={
									updatedInventory.find(
										(updItem) =>
											updItem.productId === item.productId,
									)?.quantity || ""
								}
								onChange={(e) =>
									handleInventoryChange(
										item.productId,
										item.productName,
										e.target.value,
									)
								}
							/>
						</div>
					))
				)}
				<button onClick={updateInventory}>Update Inventory</button>
			</div>
		</div>
	);
}

export default Inventory;
