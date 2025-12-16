import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import { generateBaseURL } from "../../../utils.js";
import { useAuth } from "../../../contexts/onAuth.js";

const AdminLogin = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [auth, setAuth] = useAuth();

	const navigate = useNavigate();

	//check token expiry
	useEffect(() => {
		const authData = JSON.parse(localStorage.getItem("auth"));

		if (authData && authData.token) {
			const decodedToken = decodeToken(authData.token);

			if (decodedToken && decodedToken.exp) {
				const currentTime = Math.floor(Date.now() / 1000);

				if (decodedToken.exp < currentTime) {
					logoutUser();
				} else {
					setAuth({
						user: authData.user,
						token: authData.token,
					});

					const expiresIn = decodedToken.exp - currentTime;
					setTimeout(logoutUser, expiresIn * 1000);
				}
			}
		}
	}, [setAuth]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/auth/admin-login`, {
				method: "POST", // Specify the HTTP method
				headers: {
					"Content-Type": "application/json", // Set the content type
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			if (response.ok) {
				const responseData = await response.json();
				if (responseData.success) {
					toast.success(responseData.success);
					setAuth({
						user: responseData.user,
						token: responseData.token,
					});
					localStorage.setItem("auth", JSON.stringify(responseData));
					navigate("/dashboard/admin");
				} else {
					toast.error("Error in logging");
				}
			} else {
				toast.error("An error occurred");
			}
		} catch (error) {
			console.log(error);
			toast.error("An error occurred");
		}
	};

	const logoutUser = () => {
		setAuth({ user: null, token: null });
		localStorage.removeItem("auth");
		toast.error("Session expired. Please log in again.");
	};

	return (
		<>
			<div className="form-container">
				<form onSubmit={handleSubmit} className="login-form">
					<h4 className="title">Admin Login</h4>

					<div className="mb-3">
						<input
							type="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="form-control"
							id="exampleInputUsername1"
							placeholder="Enter Your Username"
							required
						/>
					</div>
					<div className="mb-3">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="form-control"
							id="exampleInputPassword1"
							placeholder="Enter Your Password"
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						LOGIN
					</button>
				</form>
			</div>
		</>
	);
};

//logic for decoding toekn
function decodeToken(token) {
	if (!token) {
		return null;
	}

	const base64Url = token.split(".")[1];
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
			.join(""),
	);

	return JSON.parse(jsonPayload);
}

export default AdminLogin;
