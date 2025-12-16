/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("User Quotas Feature Testing", () => {
	let adminToken;
	let userToken;
	let userId;

	before(async () => {
		// Login as admin
		const adminLoginRes = await chai
			.request(app)
			.post("/api/auth/admin-login")
			.send({
				username: "admin@mail.com",
				password: "admin123",
			});

		adminToken = adminLoginRes.body.token;

		// Login as user
		const userLoginRes = await chai
			.request(app)
			.post("/api/auth/login")
			.send({
				email: "user@mail.com",
				password: "user123",
			});

		userToken = userLoginRes.body.token;

		// Get user ID
		const usersRes = await chai
			.request(app)
			.get("/api/auth")
			.set("Authorization", adminToken);

		const user = usersRes.body.find((u) => u.email === "user@mail.com");
		userId = user._id;
	});

	describe("GET /api/quotas/users", () => {
		it("should return all users with quotas for admin", async () => {
			const res = await chai
				.request(app)
				.get("/api/quotas/users")
				.set("Authorization", adminToken);

			expect(res).to.have.status(200);
			expect(res.body).to.be.an("array");
			expect(res.body.length).to.be.greaterThan(0);

			// Check if users have quota fields
			const user = res.body.find((u) => u.email === "user@mail.com");
			expect(user).to.have.property("quotas");
			expect(user).to.have.property("usage");
		});

		it("should deny access for non-admin users", async () => {
			const res = await chai
				.request(app)
				.get("/api/quotas/users")
				.set("Authorization", userToken);

			expect(res).to.have.status(401);
		});
	});

	describe("GET /api/quotas/users/:userId", () => {
		it("should return specific user quotas for admin", async () => {
			const res = await chai
				.request(app)
				.get(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken);

			expect(res).to.have.status(200);
			expect(res.body).to.have.property("userId");
			expect(res.body).to.have.property("email");
			expect(res.body).to.have.property("quotas");
			expect(res.body).to.have.property("usage");
		});

		it("should return 404 for non-existent user", async () => {
			const fakeId = "507f1f77bcf86cd799439011";
			const res = await chai
				.request(app)
				.get(`/api/quotas/users/${fakeId}`)
				.set("Authorization", adminToken);

			expect(res).to.have.status(404);
		});
	});

	describe("PUT /api/quotas/users/:userId", () => {
		it("should update user quotas successfully", async () => {
			const newQuotas = {
				quotas: {
					maxOrdersPerDay: 5,
					maxProductsPerOrder: 25,
					maxTotalOrderValue: 5000,
				},
			};

			const res = await chai
				.request(app)
				.put(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken)
				.send(newQuotas);

			expect(res).to.have.status(200);
			expect(res.body).to.have.property("success", true);
			expect(res.body).to.have.property(
				"message",
				"User quotas updated successfully",
			);
		});

		it("should validate quota values", async () => {
			const invalidQuotas = {
				quotas: {
					maxOrdersPerDay: -5, // Should be converted to 0
				},
			};

			const res = await chai
				.request(app)
				.put(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken)
				.send(invalidQuotas);

			expect(res).to.have.status(200);
			expect(res.body).to.have.property("success", true);
		});
	});

	describe("POST /api/quotas/check-order/:userId", () => {
		it("should reject order exceeding daily limit", async () => {
			// First, set a very low daily limit
			await chai
				.request(app)
				.put(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken)
				.send({
					quotas: { maxOrdersPerDay: 1 },
				});

			// Manually update usage to simulate 1 order already placed today
			const today = new Date().toISOString().split("T")[0];

			await chai
				.request(app)
				.put(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken)
				.send({
					usage: {
						ordersToday: 1,
						lastOrderDate: today,
					},
				});

			const orderData = {
				orderValue: 100,
				productCount: 2,
			};

			const res = await chai
				.request(app)
				.post(`/api/quotas/check-order/${userId}`)
				.set("Authorization", userToken)
				.send(orderData);

			expect(res).to.have.status(429);
			expect(res.body).to.have.property("error");
			expect(res.body.error).to.include("Daily order limit exceeded");
		});
	});

	describe("POST /api/orders - Order Creation and Usage Tracking", () => {
		it("should update ordersToday when order is created", async () => {
			// Reset user usage to allow new order
			await chai
				.request(app)
				.put(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken)
				.send({
					usage: {
						ordersToday: 0,
						lastOrderDate: "2023-01-01",
					},
				});

			// Create an order
			const orderData = {
				username: "user",
				totalAmount: 49,
				products: [
					{ name: "Smart Speaker", price: 49, quantity: 1 },
				],
				address: "Test Address",
				payment: "credit",
			};

			const res = await chai
				.request(app)
				.post("/api/orders")
				.send(orderData);

			expect(res).to.have.status(201);

			// Check if ordersToday was updated
			const userQuotasRes = await chai
				.request(app)
				.get(`/api/quotas/users/${userId}`)
				.set("Authorization", adminToken);

			expect(userQuotasRes).to.have.status(200);
			expect(userQuotasRes.body.usage.ordersToday).to.be.greaterThan(0);
		});
	});
});
