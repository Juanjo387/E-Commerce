import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu.js";
import { useAuth } from "../../../contexts/onAuth.js";
import "./Orders.css";
import { generateBaseURL } from "../../../utils.js";
import { useCurrency } from "../../../contexts/currencyContext";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [auth] = useAuth();
	const username = auth?.user?.username;
	const { convertPrice } = useCurrency();

	useEffect(() => {
		getUserOrders();
	}, []);

	const getUserOrders = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/orders/${username}`, {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			const ordersData = await response.json();
			setOrders(ordersData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container-fluid p-3 m-3">
			<div className="row">
				<div className="col-md-3">
					<UserMenu />
				</div>
				<div className="col-md-9">
					<h1>All Orders</h1>
					{orders !== null && orders.length > 0 ? (
						<div className="card-container">
							{orders.map((order) => (
								<div className="card" key={order._id}>
									<div className="card-header">
										<h1
											data-testid="total-amount"
											className="card-title"
										>
											Total Amount $ {convertPrice(order.totalAmount)}
										</h1>
									</div>
									<div className="card-address">
										<h3>Shipping Address</h3>
										<p data-testid="street">Street: </p>
										<p data-testid="city">City: </p>
										<p data-testid="state">State: </p>
										<p data-testid="zipCode">ZIP Code: </p>
									</div>
									{order.products !== null &&
									order.products.length > 0 ? (
											<div data-testid="products-detail" className="card-address">
												<h3>Products</h3>
												<ul>
													{order.products.map(
														(product, index) => (
															<li key={index}>
																<h4 data-testid="products-name">
																	{product.name}
																</h4>
																<p className="products-price" data-testid="products-price">
																	Price:{" "}{convertPrice(product.price)}
																</p>
																{product.priceDifference && (
																	<p>Involved in an exchange, paid ${convertPrice(product.priceDifference)} extra</p>
																)}																
															</li>
														),
													)}
												</ul>
											</div>
										) : (
											<p className="card-content">
											No products found for this order.
											</p>
										)}
								</div>
							))}
						</div>
					) : (
						<p>No orders found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Orders;
