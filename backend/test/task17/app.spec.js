/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Feature Testing", () => {
	it("should return correct status code and error message for excessive user and admin login attempts", async function () {
		const loginData = {
			email: "user@mail.com",
			password: "user123",
		};

		const adminLoginData = {
			username: "admin@mail.com",
			password: "admin123",
		};

		let res = await chai
			.request(app)
			.post("/api/auth/login")
			.send(loginData);
		expect(res).to.have.status(200);

		res = await chai.request(app).post("/api/auth/login").send(loginData);
		expect(res).to.have.status(200);

		res = await chai.request(app).post("/api/auth/login").send(loginData);
		expect(res).to.have.status(200);

		res = await chai
			.request(app)
			.post("/api/auth/admin-login")
			.send(adminLoginData);
		expect(res).to.have.status(200);

		res = await chai
			.request(app)
			.post("/api/auth/admin-login")
			.send(adminLoginData);
		expect(res).to.have.status(200);

		res = await chai.request(app).post("/api/auth/login").send(loginData);
		expect(res).to.have.status(429);
		expect(res.body).to.deep.equal({
			error: "Too many login attempts. Please try again after 2 minutes.",
		});

		res = await chai
			.request(app)
			.post("/api/auth/admin-login")
			.send(adminLoginData);
		expect(res).to.have.status(429);
		expect(res.body).to.deep.equal({
			error: "Too many login attempts. Please try again after 2 minutes.",
		});
	});

	it("should verify rate limit headers on excessive user login attempts", async function () {
		const loginData = {
			email: "user@mail.com",
			password: "user123",
		};

		const res = await chai
			.request(app)
			.post("/api/auth/login")
			.send(loginData);

		expect(res).to.have.status(429);
		expect(res.body).to.deep.equal({
			error: "Too many login attempts. Please try again after 2 minutes.",
		});
		expect(res.headers["ratelimit-policy"]).to.deep.equal("5;w=120");
	});

	it("should verify rate limit headers on excessive admin login attempts", async function () {
		const adminLoginData = {
			username: "admin@mail.com",
			password: "admin123",
		};

		const res = await chai
			.request(app)
			.post("/api/auth/admin-login")
			.send(adminLoginData);

		expect(res).to.have.status(429);
		expect(res.body).to.deep.equal({
			error: "Too many login attempts. Please try again after 2 minutes.",
		});
		expect(res.headers["ratelimit-policy"]).to.deep.equal("5;w=120");
	});

	it("should return correct status code and error message for excessive order creation attempts", async function () {
		const orderData = {
			username: "testUser",
			totalAmount: 999,
			products: [
				{
					id: "67f64835659f5e832c966291",
					sNo: 99,
					name: "Test Product",
					price: 999,
				},
			],
			address: "",
			payment: {
				cardNumber: "1234567887654321",
				expiryDate: "05/25",
				cvv: "123",
			},
		};

		let res = await chai.request(app).post("/api/orders").send(orderData);
		expect(res).to.have.status(201);

		res = await chai.request(app).post("/api/orders").send(orderData);
		expect(res).to.have.status(201);

		res = await chai.request(app).post("/api/orders").send(orderData);
		expect(res).to.have.status(201);

		res = await chai.request(app).post("/api/orders").send(orderData);
		expect(res).to.have.status(429);
		expect(res.body).to.deep.equal({
			error: "Too many orders created. Please try again after 1.5 minutes.",
		});
	});

	it("should verify rate limit headers on excessive order creation attempts", async function () {
		const orderData = {
			username: "testUser",
			totalAmount: 999,
			products: [
				{
					id: "67f64835659f5e832c966291",
					sNo: 99,
					name: "Test Product",
					price: 999,
				},
			],
			address: "",
			payment: {
				cardNumber: "1234567887654321",
				expiryDate: "05/25",
				cvv: "123",
			},
		};

		const res = await chai.request(app).post("/api/orders").send(orderData);

		expect(res).to.have.status(429);
		expect(res.body).to.deep.equal({
			error: "Too many orders created. Please try again after 1.5 minutes.",
		});
		expect(res.headers["ratelimit-policy"]).to.deep.equal("3;w=90");
	});
});
