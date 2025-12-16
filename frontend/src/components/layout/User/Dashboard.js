import React from "react";
import UserMenu from "./UserMenu.js";
import { useAuth } from "../../../contexts/onAuth.js";
const Dashboard = () => {
	const [auth] = useAuth();
	console.log("Dashboard", auth);
	return (
		<div className="container-flui m-3 p-3">
			<div className="row">
				<div className="col-md-3">
					<UserMenu />
				</div>
				<div className="col-md-9">
					<div className="card w-75 p-3">
						<h3>User Name: {auth?.user?.username}</h3>
						<h3>User Email: {auth?.user?.email}</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
