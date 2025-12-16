import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner.js";
import { generateBaseURL } from "../utils.js";
import { useAuth } from "../contexts/onAuth.js";

export default function PrivateRoute() {
	const [ok, setOk] = useState(false);
	const [auth] = useAuth();

	useEffect(() => {
		const authCheck = async () => {
			const baseURL = generateBaseURL();
			try {
				const response = await fetch(`${baseURL}/api/auth/admin-auth`, {
					method: "GET",
					headers: {
						Authorization: `${auth.token}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					if (data.ok) {
						setOk(true);
					} else {
						setOk(false);
					}
				} else {
					setOk(false);
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				setOk(false);
			}
		};
		if (auth?.token) authCheck();
	}, [auth?.token]);

	return ok ? <Outlet /> : <Spinner path="" />;
}
