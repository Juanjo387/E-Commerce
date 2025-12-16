import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateBaseURL } from "../../../utils.js";
import "./ForgotPassword.css";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [OTP, setOTP] = useState("");
	const [showOTPPopup, setShowOTPPopup] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/auth/password-reset/initiate`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						oldPassword,
						newPassword,
						confirmNewPassword,
					}),
				},
			);

			if (response.ok) {
				setShowOTPPopup(true);
				toast.success("OTP generated. Check console for OTP.");
			} else {
				const errorData = await response.text();
				toast.error(errorData);
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred");
		}
	};

	const handleOTPSubmit = async (e) => {
		e.preventDefault();
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/auth/password-reset/verify`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, OTP }),
				},
			);

			if (response.ok) {
				const updateResponse = await fetch(
					`${baseURL}/api/auth/password-reset/update`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, newPassword }),
					},
				);

				if (updateResponse.ok) {
					toast.success("Password reset successfully");
					navigate("/login");
				} else {
					const errorData = await updateResponse.text();
					toast.error(errorData);
				}
			} else {
				const errorData = await response.text();
				toast.error(errorData);
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred");
		}
	};

	const handleClosePopup = () => {
		setShowOTPPopup(false);
	};

	return (
		<div className="form-container">
			<form onSubmit={handleSubmit} className="forgot-password-form">
				<h4 className="title">Forgot Password</h4>
				<div className="mb-3">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="form-control"
						placeholder="Enter Your Email"
						required
					/>
				</div>
				<div className="mb-3">
					<input
						type="password"
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
						className="form-control"
						placeholder="Enter Your Old Password"
						required
					/>
				</div>
				<div className="mb-3">
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="form-control"
						placeholder="Enter Your New Password"
						required
					/>
				</div>
				<div className="mb-3">
					<input
						type="password"
						value={confirmNewPassword}
						onChange={(e) => setConfirmNewPassword(e.target.value)}
						className="form-control"
						placeholder="Confirm Your New Password"
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>

			{showOTPPopup && (
				<div className="OTP-popup">
					<button
						className="close-button"
						onClick={handleClosePopup}
					>
						&times;
					</button>
					<form onSubmit={handleOTPSubmit}>
						<div className="mb-3">
							<input
								type="text"
								value={OTP}
								onChange={(e) => setOTP(e.target.value)}
								className="form-control"
								placeholder="Enter OTP"
								required
							/>
						</div>
						<button type="submit" className="btn btn-primary">
							Verify OTP
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default ForgotPassword;