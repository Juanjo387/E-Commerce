import React, { useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "../../../contexts/onAuth.js";
import { generateBaseURL } from "../../../utils.js";
import { ShopContext } from "../../../contexts/shopContext.js";
import { PRODUCTS } from "../../../products.js";

const QuotaCheck = ({ onQuotaCheck }) => {
	const [quotaStatus, setQuotaStatus] = useState(null);
	const [loading, setLoading] = useState(true);
	const [auth] = useAuth();
	const { cartItems } = useContext(ShopContext);
	const baseURL = generateBaseURL();

	const checkQuota = useCallback(async () => {
		try {
			setLoading(true);

			// Get user info to get the user ID
			const userResponse = await fetch(
				`${baseURL}/api/auth/profile/${auth.user.email}`,
				{
					headers: {
						Authorization: auth.token,
					},
				},
			);

			if (!userResponse.ok) {
				throw new Error("Failed to fetch user data");
			}

			const userData = await userResponse.json();

			// Calculate order details from cartItems
			let totalValue = 0;
			let productCount = 0;

			for (const itemId in cartItems) {
				const quantity = cartItems[itemId] || 0;
				if (quantity > 0) {
					const product = PRODUCTS.find(
						(p) => p.sNo === Number(itemId),
					);
					if (product) {
						totalValue += quantity * product.price;
						productCount += quantity;
					}
				}
			}

			// Check quota
			const quotaResponse = await fetch(
				`${baseURL}/api/quotas/check-order/${userData._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: auth.token,
					},
					body: JSON.stringify({
						orderValue: totalValue,
						productCount: productCount,
					}),
				},
			);

			const quotaInfo = await quotaResponse.json();

			if (quotaResponse.ok) {
				setQuotaStatus({
					canOrder: true,
					quotas: quotaInfo.quotas,
					usage: quotaInfo.usage,
					orderValue: totalValue,
					productCount: productCount,
				});
				if (onQuotaCheck) onQuotaCheck(true, null);
			} else {
				setQuotaStatus({
					canOrder: false,
					error: quotaInfo.error,
					limit: quotaInfo.limit,
					used: quotaInfo.used,
					requested: quotaInfo.requested,
				});
				if (onQuotaCheck) onQuotaCheck(false, quotaInfo.error);
			}
		} catch (error) {
			console.error("Error checking quota:", error);
			setQuotaStatus({
				canOrder: false,
				error: "Unable to check quota limits",
			});
			if (onQuotaCheck)
				onQuotaCheck(false, "Unable to check quota limits");
		} finally {
			setLoading(false);
		}
	}, [cartItems, auth.token, baseURL]);

	useEffect(() => {
		checkQuota();
	}, [checkQuota]);

	if (loading) {
		return (
			<div className="quota-check-container">
				<div className="alert alert-info">
					<i className="fas fa-spinner fa-spin me-2"></i>
					Checking order limits...
				</div>
			</div>
		);
	}

	if (!quotaStatus) {
		return null;
	}

	if (!quotaStatus.canOrder) {
		return (
			<div className="quota-check-container">
				<div className="alert alert-danger">
					<p className="mb-2">{quotaStatus.error}</p>
					{quotaStatus.limit && quotaStatus.used && (
						<small>
							Limit: {quotaStatus.limit}, Used: {quotaStatus.used}
							{quotaStatus.requested &&
								`, Requested: ${quotaStatus.requested}`}
						</small>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="quota-check-container">
			<div className="alert alert-success">
				<h6>
					<i className="fas fa-check-circle"></i>Order Limits
					Check
				</h6>
				<div className="row">
					<div className="col-md-12">
						<small>
							<strong>Order Value:</strong> $
							{quotaStatus.orderValue?.toFixed(2) || 0}
							{quotaStatus.quotas?.maxTotalOrderValue && (
								<span className="text-muted">
									{" "}
									/ ${quotaStatus.quotas.maxTotalOrderValue}
								</span>
							)}
						</small>
					</div>
					<div className="col-md-12">
						<small>
							<strong>Products Per Order:</strong>{" "}
							{quotaStatus.productCount || 0}
							{quotaStatus.quotas?.maxProductsPerOrder && (
								<span className="text-muted">
									{" "}
									/ {quotaStatus.quotas.maxProductsPerOrder}
								</span>
							)}
						</small>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<small>
							<strong>Daily Orders:</strong>{" "}
							{quotaStatus.usage?.ordersToday || 0}
							{quotaStatus.quotas?.maxOrdersPerDay && (
								<span className="text-muted">
									{" "}
									/ {quotaStatus.quotas.maxOrdersPerDay}
								</span>
							)}
						</small>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuotaCheck;
