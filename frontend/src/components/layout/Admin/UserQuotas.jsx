import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { generateBaseURL } from "../../../utils.js";
import { useAuth } from "../../../contexts/onAuth.js";
import "./UserQuotas.css";

const UserQuotas = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [quotas, setQuotas] = useState({
		maxOrdersPerDay: 10,
		maxProductsPerOrder: 50,
		maxTotalOrderValue: 10000,
	});

	const [auth] = useAuth();
	const baseURL = generateBaseURL();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${baseURL}/api/quotas/users`, {
				headers: {
					Authorization: auth.token,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			const usersData = await response.json();
			setUsers(usersData.filter((user) => user.role === "user")); // Only show regular users
		} catch (error) {
			console.error("Error fetching users:", error);
			toast.error("Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	const handleUserSelect = async (userId) => {
		try {
			const response = await fetch(
				`${baseURL}/api/quotas/users/${userId}`,
				{
					headers: {
						Authorization: auth.token,
					},
				},
			);

			if (!response.ok) {
				throw new Error("Failed to fetch user quotas");
			}

			const userData = await response.json();
			setSelectedUser(userData);
			setQuotas({
				maxOrdersPerDay: userData.quotas?.maxOrdersPerDay || 10,
				maxProductsPerOrder: userData.quotas?.maxProductsPerOrder || 50,
				maxTotalOrderValue:
					userData.quotas?.maxTotalOrderValue || 10000,
			});
		} catch (error) {
			console.error("Error fetching user quotas:", error);
			toast.error("Failed to fetch user quotas");
		}
	};

	const handleQuotaChange = (field, value) => {
		setQuotas((prev) => ({
			...prev,
			[field]: value === "" ? "" : parseInt(value) || 0,
		}));
	};

	const handleUpdateQuotas = async () => {
		if (!selectedUser) return;

		// Validate and clean quota values
		const cleanedQuotas = {
			maxOrdersPerDay:
				quotas.maxOrdersPerDay === ""
					? 0
					: parseInt(quotas.maxOrdersPerDay) || 0,
			maxProductsPerOrder:
				quotas.maxProductsPerOrder === ""
					? 0
					: parseInt(quotas.maxProductsPerOrder) || 0,
			maxTotalOrderValue:
				quotas.maxTotalOrderValue === ""
					? 0
					: parseInt(quotas.maxTotalOrderValue) || 0,
		};

		try {
			setUpdating(true);
			const response = await fetch(
				`${baseURL}/api/quotas/users/${selectedUser.userId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: auth.token,
					},
					body: JSON.stringify({ quotas: cleanedQuotas }),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to update quotas");
			}

			const result = await response.json();
			toast.success("Quotas updated successfully");

			// Refresh user data
			await handleUserSelect(selectedUser.userId);
		} catch (error) {
			console.error("Error updating quotas:", error);
			toast.error("Failed to update quotas");
		} finally {
			setUpdating(false);
		}
	};

	const getUsagePercentage = (used, limit) => {
		if (!limit || limit === 0) return 0;
		return Math.min((used / limit) * 100, 100);
	};

	const getUsageColor = (percentage) => {
		if (percentage >= 90) return "danger";
		if (percentage >= 75) return "warning";
		return "success";
	};

	const getUsageStatus = (percentage) => {
		if (percentage >= 90) return "Critical";
		if (percentage >= 75) return "Warning";
		return "Good";
	};

	if (loading) {
		return (
			<div className="quota-management-container">
				<h2 className="quota-management-title">
					User Quotas & Limits Management
				</h2>
				<div className="text-center" style={{ padding: "3rem" }}>
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
					<p className="mt-2">Loading users and quotas...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="quota-management-container">
			<h2 className="quota-management-title">
				User Quotas & Limits Management
			</h2>

			<div className="quota-management-controls">
				<label htmlFor="user-select" className="quota-management-label">
					Select User:
				</label>
				<select
					id="user-select"
					value={selectedUser?.userId || ""}
					onChange={(e) => {
						const userId = e.target.value;
						if (userId) {
							handleUserSelect(userId);
						}
					}}
					className="quota-management-select"
				>
					<option value="">Select a user to manage quotas</option>
					{users.map((user) => (
						<option key={user._id} value={user._id}>
							{user.username || user.email} ({user.email})
						</option>
					))}
				</select>
			</div>

			{selectedUser ? (
				<div className="quota-management-content">
					<div className="quota-section">
						<h3 className="quota-section-title">
							Current Usage -{" "}
							{selectedUser.username || selectedUser.email}
						</h3>

						<div className="usage-grid">
							<div className="usage-card">
								<div className="usage-header">
									<span className="usage-label">
										Orders Today
									</span>
									<span
										className={`usage-badge badge-${getUsageColor(
											getUsagePercentage(
												selectedUser.usage
													?.ordersToday || 0,
												selectedUser.quotas
													?.maxOrdersPerDay || 10,
											),
										)}`}
									>
										{getUsageStatus(
											getUsagePercentage(
												selectedUser.usage
													?.ordersToday || 0,
												selectedUser.quotas
													?.maxOrdersPerDay || 10,
											),
										)}
									</span>
								</div>
								<div className="usage-progress">
									<div
										className={`usage-progress-bar progress-${getUsageColor(
											getUsagePercentage(
												selectedUser.usage
													?.ordersToday || 0,
												selectedUser.quotas
													?.maxOrdersPerDay || 10,
											),
										)}`}
										style={{
											width: `${getUsagePercentage(
												selectedUser.usage
													?.ordersToday || 0,
												selectedUser.quotas
													?.maxOrdersPerDay || 10,
											)}%`,
										}}
									></div>
								</div>
								<div className="usage-details">
									{selectedUser.usage?.ordersToday || 0} /{" "}
									{selectedUser.quotas?.maxOrdersPerDay || 10}
								</div>
							</div>
						</div>
					</div>

					<div className="quota-form-section">
						<h3 className="quota-section-title">Set Quotas</h3>
						<div className="quota-form-grid">
							<div className="form-group">
								<label className="form-label">
									Max Orders Per Day
								</label>
								<input
									type="number"
									className="form-control"
									value={quotas.maxOrdersPerDay}
									onChange={(e) =>
										handleQuotaChange(
											"maxOrdersPerDay",
											e.target.value,
										)
									}
									min="0"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">
									Max Products Per Order
								</label>
								<input
									type="number"
									className="form-control"
									value={quotas.maxProductsPerOrder}
									onChange={(e) =>
										handleQuotaChange(
											"maxProductsPerOrder",
											e.target.value,
										)
									}
									min="0"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">
									Max Total Order Value
								</label>
								<input
									type="number"
									className="form-control"
									value={quotas.maxTotalOrderValue}
									onChange={(e) =>
										handleQuotaChange(
											"maxTotalOrderValue",
											e.target.value,
										)
									}
									min="0"
								/>
							</div>

							<div className="form-group update-button-container">
								<button
									className="btn btn-primary update-quotas-btn"
									onClick={handleUpdateQuotas}
									disabled={updating}
								>
									{updating ? "Updating..." : "Update Quotas"}
								</button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="no-user-selected">
					<p>
						Select a user from the dropdown above to manage their
						quotas and limits
					</p>
				</div>
			)}
		</div>
	);
};

export default UserQuotas;
