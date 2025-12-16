import React, { useState } from "react";
import "./OrderList.css";

const OrderList = () => {
	const [orders, setOrders] = useState([]);

	//fetch orders
	async function fetchOrders() {
		try {
			const response = await fetch("/api/orders");

			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			setOrders(response);
		} catch (error) {
			console.error("Error retrieving orders:", error);
		}
	}
	fetchOrders();

	return (
		<div data-testid="order-list" className="order-list-container">
			<h2>Order List</h2>
			{orders.length > 0 ? (
				orders.map((order) => (
					<div key={order._id} className="order-item">
						<h4 data-testid="order-id">Order ID: {order.id}</h4>
						<p data-testid="customer-name">
							Customer Name: {order.username}
						</p>
						<p data-testid="amount">
							Total Amount: ${order.totalAmount}
						</p>
					</div>
				))
			) : (
				<p>No orders available.</p>
			)}
			<div className="total-amount">
				<p data-testid="all-orders-amount">
					Total Amount of All Orders: $NA
				</p>
			</div>
		</div>
	);
};

export default OrderList;
