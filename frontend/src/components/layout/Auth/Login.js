import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

import "./Login.css";
import { useAuth } from "../../../contexts/onAuth.js";
import { generateBaseURL } from "../../../utils.js";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [, setAuth] = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

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
			const response = await fetch(`${baseURL}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (!response.ok) {
				throw new Error(`Error in logging: ${response.statusText}`);
			}

			const responseData = await response.json();

			if (responseData.success) {
				toast.success(responseData.success);
				setAuth({
					user: responseData.user,
					token: responseData.token,
				});
				localStorage.setItem("auth", JSON.stringify(responseData));
				navigate(location.state || "/");
			} else {
				toast.error("Error in logging");
			}
		} catch (error) {
			console.error(error);
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
					<h4 className="title">Login</h4>

					<div className="mb-3">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="form-control"
							id="exampleInputEmail1"
							placeholder="Enter Your Email"
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
			<div className="new-user">
				{" "}
				New user?&nbsp; <Link data-testid="new-user"> Please Register</Link>
			</div>
			<div className="admin-login">
				Are you Admin?&nbsp; <Link to="/admin-login"> login here</Link>
			</div>
			<div className="forgot-password">
				Forgot Password?&nbsp; <Link to="/forgot-password">Click here</Link>
			</div>
		</>
	);
};

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

export default Login;
