import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./Payment.css";
import { ShopContext } from "../../../contexts/shopContext";
import { PRODUCTS } from "../../../products";
import { useAuth } from "../../../contexts/onAuth";
import { generateBaseURL } from "../../../utils.js";

const Payment = () => {
	const [cardNumber, setCardNumber] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [cvv, setCvv] = useState("");
	const [loading, setLoading] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [errors, setErrors] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
	});

	const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
	const totalAmount = getTotalCartAmount();
	const [auth] = useAuth();
	const username = auth?.user?.username;

	const navigate = useNavigate();
	const address = "";

	const handleOrder = async () => {
		try {
			const baseURL = generateBaseURL();
			const products = PRODUCTS.filter(
				(product) => cartItems[product.sNo] !== 0,
			);
			const orderData = {
				username,
				totalAmount,
				products,
				address,
				payment: {
					cardNumber,
					expiryDate,
					cvv,
				},
			};

			await fetch(`${baseURL}/api/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			});
			checkout();
			setPaymentSuccess(true);
		} catch (error) {
			console.error(error);
		}
	};

	const validateForm = () => {
		let valid = true;
		const newErrors = { cardNumber: "", expiryDate: "", cvv: "" };

		// Card Number validation
		if (cardNumber.trim() === "") {
			newErrors.cardNumber = "Card number is required";
			valid = false;
		} else if (!/^\d{16}$/.test(cardNumber)) {
			newErrors.cardNumber = "Card number should be 16 digits";
			valid = false;
		}

		// Expiry Date validation
		if (expiryDate.trim() === "") {
			newErrors.expiryDate = "Expiry date is required";
			valid = false;
		} else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
			newErrors.expiryDate = "Expiry date should be in MM/YY format";
			valid = false;
		}

		// CVV validation
		if (cvv.trim() === "") {
			newErrors.cvv = "CVV is required";
			valid = false;
		} else if (!/^\d{3}$/.test(cvv)) {
			newErrors.cvv = "CVV should be 3 digits";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handlePaymentSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			setLoading(true);

			// Simulating payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simulating successful payment
			setPaymentSuccess(true);
			setLoading(false);
			handleOrder(); // Call handleOrder after successful payment
		}
	};

	return (
		<div className="payment-container">
			<h2 className="payment-title">Payment</h2>
			{paymentSuccess ? (
				<div>
					<p className="payment-success">Payment Successful!</p>
					<p>Thank you for your purchase.</p>
					<button
						className="payment-btn"
						onClick={() => navigate("/")}
					>
						Continue Shopping
					</button>
					<button
						className="payment-btn"
						onClick={() => navigate("/dashboard/user/orders")}
					>
						Your Orders
					</button>
				</div>
			) : (
				<form onSubmit={handlePaymentSubmit}>
					<div className="form-group">
						<label>Card Number:</label>
						<input
							data-testid="cardNumber"
							type="text"
							value={cardNumber}
							onChange={(e) => setCardNumber(e.target.value)}
						/>
						{errors.cardNumber && (
							<span className="text-danger">
								{errors.cardNumber}
							</span>
						)}
					</div>
					<div className="form-group">
						<label>Expiry Date:</label>
						<input
							data-testid="expiryDate"
							type="text"
							value={expiryDate}
							onChange={(e) => setExpiryDate(e.target.value)}
						/>
						{errors.expiryDate && (
							<span className="text-danger">
								{errors.expiryDate}
							</span>
						)}
					</div>
					<div className="form-group">
						<label>CVV:</label>
						<input
							data-testid="cvv"
							type="text"
							value={cvv}
							onChange={(e) => setCvv(e.target.value)}
						/>
						{errors.cvv && (
							<span className="text-danger">{errors.cvv}</span>
						)}
					</div>
					<button
						data-testid="paymentButton"
						type="submit"
						className="payment-button"
						disabled={loading}
					>
						{loading ? "Processing..." : "Make Payment"}
					</button>
				</form>
			)}
		</div>
	);
};

export default Payment;
