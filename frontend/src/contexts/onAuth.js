import React, { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		user: null,
		token: "",
		isLoading: true,
	});

	// Default headers
	const defaultHeaders = new Headers();
	defaultHeaders.append("Authorization", auth.token);

	useEffect(() => {
		const data = localStorage.getItem("auth");
		if (data) {
			const parseData = JSON.parse(data);
			setAuth({
				...auth,
				user: parseData.user,
				token: parseData.token,
				isLoading: false,
			});
		} else {
			setAuth({
				...auth,
				isLoading: false,
			});
		}
		// eslint-disable-next-line
	}, []);

	return (
		<AuthContext.Provider value={[auth, setAuth]}>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
