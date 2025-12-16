import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuotaCheck from "../../layout/User/QuotaCheck.jsx";
import "./checkout.css";

function Checkout() {
	const navigate = useNavigate();
	const [address, setAddress] = useState({
		street: "",
		city: "",
		state: "",
		zipCode: "",
	});
	const [errors, setErrors] = useState({});
	const [quotaValid, setQuotaValid] = useState(true);
	const [quotaError, setQuotaError] = useState(null);

	const handleInputChange = (e) => {
		setAddress({ ...address, [e.target.name]: e.target.value });
	};

	const handleQuotaCheck = (isValid, error) => {
		setQuotaValid(isValid);
		setQuotaError(error);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validateForm();

		if (Object.keys(validationErrors).length === 0 && quotaValid) {
			navigate("/checkout/payment");
		} else {
			setErrors(validationErrors);
		}
	};

	const validateForm = () => {
		const errors = {};

		if (!address.street.trim()) {
			errors.street = "Street is required";
		}
		if (!address.city.trim()) {
			errors.city = "City is required";
		}
		if (!address.state.trim()) {
			errors.state = "State is required";
		}
		if (!address.zipCode.trim()) {
			errors.zipCode = "ZIP code is required";
		}

		return errors;
	};

	return (
		<div className="checkout-container">
			<QuotaCheck onQuotaCheck={handleQuotaCheck} />
			<form onSubmit={handleSubmit} className="checkout-form">
				<h2>Shipping Address</h2>

				<div className="mb-3">
					<label htmlFor="street" className="form-label">
						Street:
					</label>
					<input
						type="text"
						data-testid="checkout-street"
						className="form-control"
						id="street"
						name="street"
						value={address.street}
						onChange={handleInputChange}
					/>
					{errors.street && (
						<span className="text-danger">{errors.street}</span>
					)}
				</div>
				<div className="mb-3">
					<label htmlFor="city" className="form-label">
						City:
					</label>
					<input
						type="text"
						data-testid="checkout-city"
						className="form-control"
						id="city"
						name="city"
						value={address.city}
						onChange={handleInputChange}
					/>
					{errors.city && (
						<span className="text-danger">{errors.city}</span>
					)}
				</div>
				<div className="mb-3">
					<label htmlFor="state" className="form-label">
						State:
					</label>
					<input
						type="text"
						data-testid="checkout-state"
						className="form-control"
						id="state"
						name="state"
						value={address.state}
						onChange={handleInputChange}
					/>
					{errors.state && (
						<span className="text-danger">{errors.state}</span>
					)}
				</div>
				<div className="mb-3">
					<label htmlFor="zipCode" className="form-label">
						ZIP Code:
					</label>
					<input
						type="text"
						data-testid="checkout-zipCode"
						className="form-control"
						id="zipCode"
						name="zipCode"
						value={address.zipCode}
						onChange={handleInputChange}
					/>
					{errors.zipCode && (
						<span className="text-danger">{errors.zipCode}</span>
					)}
				</div>
				<button
					type="submit"
					className="btn btn-primary"
					disabled={!quotaValid}
				>
					{quotaValid ? "Checkout" : "Order Limits Exceeded"}
				</button>
				<div className="mb-3 custom-select">
					<label
						htmlFor="addressSelect"
						className="form-label saveAddr-label"
					>
						Have you already saved an address? View the options in
						the dropdown menu below.
					</label>
					<select
						id="addressSelect"
						className="form-control"
						data-testid="addr-select"
					>
						<option value="">New Address</option>
					</select>
				</div>
			</form>
		</div>
	);
}

export default Checkout;
