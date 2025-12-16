import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { useAuth } from "../contexts/onAuth.js";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
	const [auth] = useAuth();
	const isAuthenticated = auth.token ? true : false;
	return (
		<Routes>
			<Route
				{...rest}
				render={(props) =>
					isAuthenticated() ? (
						<Component {...props} />
					) : (
						<Navigate to="/login" />
					)
				}
			/>
		</Routes>
	);
};
