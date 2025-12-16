import React, { useState, useEffect } from "react";
import UserMenu from "./UserMenu.js";
import { useAuth } from "../../../contexts/onAuth.js";
import toast from "react-hot-toast";
import "./Profile.css";
import { generateBaseURL } from "../../../utils.js";

const Profile = () => {
	const [auth, setAuth] = useAuth();
	const [userProfile, setUserProfile] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [dob, setDob] = useState("");

	const fetchUserProfile = async () => {
		const baseURL = generateBaseURL();
		const response = await fetch(
			`${baseURL}/api/auth/profile/${auth?.user?.email}`,
		);
		if (response.ok) {
			const data = await response.json();
			setUserProfile(data);
			setName(data.username || "N/A");
			setPhone(data.phone || "N/A");
			setAddress(data.address || "N/A");
			setDob(data.dob || "N/A");
		} else {
			toast.error("Failed to fetch user profile");
		}
	};
	useEffect(() => {
		fetchUserProfile();
	}, [auth?.user?.email]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const body = {
				username: name,
				email: auth?.user?.email,
				phone,
				address,
				dob,
			};
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/auth/profile`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					`Failed to update profile: ${errorData.error || response.statusText}`,
				);
			}

			toast.success("Profile Updated Successfully");
			setIsEditing(false);
			fetchUserProfile();
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	return (
		<div className="container-fluid m-3 p-3 dashboard">
			<div className="row">
				<div className="col-md-3">
					<UserMenu />
				</div>
				<div className="col-md-8">
					<div className="form-container">
						{!isEditing ? (
							<div>
								<h4 className="title">USER PROFILE</h4>
								<p>
									<strong>Name:</strong>{" "}
									{userProfile.username || "N/A"}
								</p>
								<p>
									<strong>Email:</strong>{" "}
									{userProfile.email || "N/A"}
								</p>
								<p>
									<strong>Phone:</strong>{" "}
									{userProfile.phone || "N/A"}
								</p>
								<p>
									<strong>Address:</strong>{" "}
									{userProfile.address || "N/A"}
								</p>
								<p>
									<strong>Date of Birth:</strong>{" "}
									{userProfile.dob || "N/A"}
								</p>
								<button
									className="btn btn-primary profile-edit-btn"
									onClick={() => setIsEditing(true)}
								>
									Edit User Profile
								</button>
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								<h4 className="title">EDIT USER PROFILE</h4>
								<div className="mb-3">
									<input
										type="text"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										className="form-control"
										placeholder="Enter Your Name"
										autoFocus
									/>
								</div>
								<div className="mb-3">
									<input
										type="email"
										value={auth?.user?.email}
										className="form-control"
										placeholder="Enter Your Email"
										disabled
									/>
								</div>
								<div className="mb-3">
									<input
										type="text"
										value={phone}
										onChange={(e) =>
											setPhone(e.target.value)
										}
										className="form-control"
										placeholder="Enter Your Phone Number"
									/>
								</div>
								<div className="mb-3">
									<input
										type="text"
										value={address}
										onChange={(e) =>
											setAddress(e.target.value)
										}
										className="form-control"
										placeholder="Enter Your Address"
									/>
								</div>
								<div className="mb-3">
									<input
										type="date"
										value={dob}
										onChange={(e) => setDob(e.target.value)}
										className="form-control"
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary"
								>
									Submit
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
