import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../../contexts/shopContext";
import { useCurrency } from "../../../contexts/currencyContext";

import "./cart.css";
import emptycart from "./empty-cart.jpg";
import { CartItem } from "./CartItem";
import { PRODUCTS } from "../../../products";
import { generateBaseURL } from "../../../utils";
import { Modal, Button } from "react-bootstrap";

export const Cart = () => {
	const { cartItems, getTotalCartAmount } = useContext(ShopContext);
	const totalAmount = getTotalCartAmount();
	const navigate = useNavigate();

	const [userPoints, setUserPoints] = useState(0);
	const [discountOptions, setDiscountOptions] = useState([]);
	const [selectedDiscount, setSelectedDiscount] = useState(null);
	const [discountedTotal, setDiscountedTotal] = useState(totalAmount);
	const [showDiscountModal, setShowDiscountModal] = useState(false);
	const { convertPrice } = useCurrency();

	useEffect(() => {
		const fetchUserPoints = async () => {
			try {
				const baseURL = generateBaseURL();
				const response = await fetch(`${baseURL}/api/discount/points`);
				const data = await response.json();
				setUserPoints(data.points);
			} catch (error) {
				console.error("Error fetching user points:", error);
			}
		};

		const fetchDiscountOptions = async () => {
			try {
				const baseURL = generateBaseURL();
				const response = await fetch(`${baseURL}/api/discount/options`);
				const data = await response.json();
				setDiscountOptions(data);
			} catch (error) {
				console.error("Error fetching discount options:", error);
			}
		};

		fetchUserPoints();
		fetchDiscountOptions();
	}, []);

	const applyDiscount = async () => {
		try {
			if (!selectedDiscount) {
				alert("Please select a discount option");
				return;
			}

			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/discount/apply`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ discount: selectedDiscount }),
			});
			const data = await response.json();
			if (data.error) {
				alert(data.error);
				return;
			}

			const discountAmount = (selectedDiscount / 100) * totalAmount;
			setDiscountedTotal(totalAmount - discountAmount);

			// Dispatch custom event to update points in the navbar
			const pointsUpdatedEvent = new CustomEvent("pointsUpdated", {
				detail: data.updatedPoints,
			});
			window.dispatchEvent(pointsUpdatedEvent);

			setShowDiscountModal(false);
		} catch (error) {
			console.error("Error applying discount:", error);
		}
	};

	return (
		<div className="cart-items">
			<div>
				<h1>Your Cart Items</h1>
			</div>
			<div className="cart">
				{totalAmount > 0 ? (
					PRODUCTS.map((product, index) => {
						const quantity = cartItems[product.sNo] || 0;
						if (quantity > 0) {
							const isLastItem = index === PRODUCTS.length - 1;
							return (
								<React.Fragment key={product.sNo}>
									<CartItem data={product} />
									{!isLastItem && (
										<div className="cart-line"></div>
									)}
								</React.Fragment>
							);
						}
						return null;
					})
				) : (
					<>
						<p>No Items added</p>
					</>
				)}
			</div>

			<div className="checkout">
				{totalAmount > 0 ? (
					<div className="check">
						<p style={{ textDecoration: selectedDiscount ? "line-through red" : "none" }} data-testid="purchase-subtotal" className="subtotal">
							Subtotal: ${convertPrice(totalAmount)}
						</p>
						{selectedDiscount && (
							<p>Discounted Total: ${discountedTotal}</p>
						)}
						<button onClick={() => navigate("/")}>
							Continue Shopping
						</button>
						<button onClick={() => navigate("/checkout")}>
							Checkout
						</button>
						<button onClick={() => setShowDiscountModal(true)}>
							Apply Discount
						</button>

						<Modal
							show={showDiscountModal}
							onHide={() => setShowDiscountModal(false)}
						>
							<Modal.Header closeButton>
								<Modal.Title>Select Discount</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								{discountOptions
									.filter(
										(option) => userPoints >= option.points,
									)
									.map((option) => (
										<label className="discount-options" key={option.points}>
											<input
												type="radio"
												name="discount"
												value={option.discount}
												onChange={(e) =>
													setSelectedDiscount(
														Number(e.target.value),
													)
												}
											/>
											{option.discount}% off (
											{option.points} Points)
										</label>
									))}
								{userPoints < 20 && (
									<p>Not enough points to apply discount</p>
								)}
							</Modal.Body>
							<Modal.Footer>
								<Button
									className="apply-button"
									onClick={applyDiscount}
								>
									Apply
								</Button>
							</Modal.Footer>
						</Modal>
					</div>
				) : (
					<div className="empty-cart">
						<img src={emptycart} alt="" />
						<h1>Your Shopping Cart is Empty</h1>
						<button onClick={() => navigate("/")}>
							Continue Shopping
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
