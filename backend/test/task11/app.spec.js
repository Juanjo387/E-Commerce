/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";

chai.use(chaiHttp);
const { expect } = chai;
describe("BugFix Testing", () => {
	it("Default inventory quantity for all products are correctly setup", (done) => {
		let inventoryData = [
			{
				productId: "",
				quantity: 1,
				productName: "myPhone",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Galexy Fone 27",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Super 4k TV 1",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Office Laptop 15",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Air Sneakers 9",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Ultra HD Camera",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Super OLED TV X2",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Gaming Laptop 1",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Ultra Sports Shoes",
			},
			{
				productId: "",
				quantity: 1,
				productName: "Smart Speaker",
			},
		];

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				for (let i = 0; i < inventoryData.length; i++) {
					inventoryData[i].productId = res.body[i]._id;
				}
				chai.request(app)
					.get("/api/inventory/all")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.be.an("array");
						expect(res.body).to.have.lengthOf(inventoryData.length);

						for (let i = 0; i < inventoryData.length; i++) {
							expect(res.body[i])
								.to.have.property("quantity")
								.to.equal(inventoryData[i].quantity);
							expect(res.body[i])
								.to.have.property("productName")
								.to.equal(inventoryData[i].productName);
							expect(res.body[i])
								.to.have.property("productId")
								.to.equal(inventoryData[i].productId);
						}
						done();
					});
			});
	});

	it("Updating one product inventory is working", (done) => {
		let inventoryData = {
			inventory: [
				{
					productId: "",
					productName: "Galexy Fone 27",
					quantity: "3",
				},
			],
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				inventoryData.inventory[0].productId = res.body[1]._id;
				chai.request(app)
					.post("/api/inventory/update")
					.send(inventoryData)
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.be.an("array");
						expect(res.body[1])
							.to.have.property("quantity")
							.to.equal(3);
						expect(res.body[1])
							.to.have.property("productName")
							.to.equal(inventoryData.inventory[0].productName);
						expect(res.body[1])
							.to.have.property("productId")
							.to.equal(inventoryData.inventory[0].productId);
						chai.request(app)
							.get("/api/inventory/all")
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body).to.be.an("array");

								expect(res.body[1])
									.to.have.property("quantity")
									.to.equal(3);
								expect(res.body[1])
									.to.have.property("productName")
									.to.equal(
										inventoryData.inventory[0].productName,
									);
								expect(res.body[1])
									.to.have.property("productId")
									.to.equal(
										inventoryData.inventory[0].productId,
									);
								done();
							});
					});
			});
	});

	it("Updating multiple products inventory is working", (done) => {
		let inventoryData = {
			inventory: [
				{
					productId: "",
					productName: "myPhone",
					quantity: "1",
				},
				{
					productId: "",
					productName: "Galexy Fone 27",
					quantity: "2",
				},
				{
					productId: "",
					productName: "Super 4k TV 1",
					quantity: "3",
				},
				{
					productId: "",
					productName: "Office Laptop 15",
					quantity: "4",
				},
				{
					productId: "",
					productName: "Air Sneakers 9",
					quantity: "5",
				},
				{
					productId: "",
					productName: "Ultra HD Camera",
					quantity: "6",
				},
				{
					productId: "",
					productName: "Super OLED TV X2",
					quantity: "7",
				},
				{
					productId: "",
					productName: "Gaming Laptop 1",
					quantity: "8",
				},
				{
					productId: "",
					productName: "Ultra Sports Shoes",
					quantity: "9",
				},
				{
					productId: "",
					productName: "Smart Speaker",
					quantity: "10",
				},
			],
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				for (let i = 0; i < inventoryData.inventory.length; i++) {
					inventoryData.inventory[i].productId = res.body[i]._id;
				}
				chai.request(app)
					.post("/api/inventory/update")
					.send(inventoryData)
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.be.an("array");
						expect(res.body).to.have.lengthOf(
							inventoryData.inventory.length,
						);
						for (
							let i = 0;
							i < inventoryData.inventory.length;
							i++
						) {
							expect(res.body[i])
								.to.have.property("quantity")
								.to.equal(i + 1);
							expect(res.body[i])
								.to.have.property("productName")
								.to.equal(
									inventoryData.inventory[i].productName,
								);
							expect(res.body[i])
								.to.have.property("productId")
								.to.equal(inventoryData.inventory[i].productId);
						}
						chai.request(app)
							.get("/api/inventory/all")
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body).to.be.an("array");
								expect(res.body).to.have.lengthOf(
									inventoryData.inventory.length,
								);
								for (
									let i = 0;
									i < inventoryData.inventory.length;
									i++
								) {
									expect(res.body[i])
										.to.have.property("quantity")
										.to.equal(i + 1);
									expect(res.body[i])
										.to.have.property("productName")
										.to.equal(
											inventoryData.inventory[i]
												.productName,
										);
									expect(res.body[i])
										.to.have.property("productId")
										.to.equal(
											inventoryData.inventory[i]
												.productId,
										);
								}
								done();
							});
					});
			});
	});

	it("Updating products inventory with invalid quantity is handled correctly", (done) => {
		let inventoryData = {
			inventory: [
				{
					productId: "",
					productName: "myPhone",
					quantity: "test",
				},
			],
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				inventoryData.inventory[0].productId = res.body[0]._id;
				chai.request(app)
					.post("/api/inventory/update")
					.send(inventoryData)
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.body.error).to.equal(
							"Invalid quantity. Quantity should be a number less than or equal to 500.",
						);
						inventoryData.inventory[0].quantity = "600";
						chai.request(app)
							.post("/api/inventory/update")
							.send(inventoryData)
							.end((err, res) => {
								expect(res).to.have.status(400);
								expect(res.body.error).to.equal(
									"Invalid quantity. Quantity should be a number less than or equal to 500.",
								);
								inventoryData.inventory[0].quantity = "";
								chai.request(app)
									.post("/api/inventory/update")
									.send(inventoryData)
									.end((err, res) => {
										expect(res).to.have.status(400);
										expect(res.body.error).to.equal(
											"Invalid quantity. Quantity should be a number less than or equal to 500.",
										);
										done();
									});
							});
					});
			});
	});

	it("Get specific product inventory is working", (done) => {
		let inventoryData = {
			productId: "",
			quantity: 10,
			productName: "Smart Speaker",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				inventoryData.productId = res.body[9]._id;
				chai.request(app)
					.get(`/api/inventory/${inventoryData.productId}`)
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body)
							.to.have.property("quantity")
							.to.equal(inventoryData.quantity);
						expect(res.body)
							.to.have.property("productName")
							.to.equal(inventoryData.productName);
						expect(res.body)
							.to.have.property("productId")
							.to.equal(inventoryData.productId);
						done();
					});
			});
	});

	it("On product purchase inventory is adjusting correctly", (done) => {
		let orderData = {
			username: "user",
			totalAmount: 1499,
			products: [
				{
					id: "",
					sNo: 3,
					name: "Super 4k TV 1",
					price: 1499,
				},
			],
			address: "",
			payment: {
				cardNumber: "1234567887654321",
				expiryDate: "05/25",
				cvv: "123",
			},
		};

		chai.request(app)
			.post("/api/orders")
			.send(orderData)
			.end((err, res) => {
				expect(res).to.have.status(201);
				chai.request(app)
					.get("/api/inventory/all")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body[2]).to.have.property("productId");
						expect(res.body[2])
							.to.have.property("productName")
							.to.equal("Super 4k TV 1");
						expect(res.body[2])
							.to.have.property("quantity")
							.to.equal(2);
						done();
					});
			});
	});

	it("Updating In Stock and Out of Stock status for products is handled correctly", (done) => {
		let inventoryData = {
			inventory: [
				{
					productId: "",
					productName: "myPhone",
					quantity: "0",
				},
				{
					productId: "",
					productName: "Galexy Fone 27",
					quantity: "0",
				},
			],
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				for (let i = 0; i < 10; i++) {
					expect(res.body[i].stockStatus).to.equal("In Stock");
				}
				chai.request(app)
					.get("/api/products")
					.end((err, res) => {
						expect(res).to.have.status(200);
						for (
							let i = 0;
							i < inventoryData.inventory.length;
							i++
						) {
							inventoryData.inventory[i].productId =
								res.body[i]._id;
						}
						chai.request(app)
							.post("/api/inventory/update")
							.send(inventoryData)
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body).to.be.an("array");
								for (
									let i = 0;
									i < inventoryData.inventory.length;
									i++
								) {
									expect(res.body[i])
										.to.have.property("quantity")
										.to.equal(0);
									expect(res.body[i])
										.to.have.property("productName")
										.to.equal(
											inventoryData.inventory[i]
												.productName,
										);
									expect(res.body[i])
										.to.have.property("productId")
										.to.equal(
											inventoryData.inventory[i]
												.productId,
										);
								}
								setTimeout(() => {
									chai.request(app)
										.get("/api/products")
										.end((err, res) => {
											expect(res).to.have.status(200);
											for (let i = 0; i < 10; i++) {
												if (i == 0 || i == 1) expect(res.body[i].stockStatus).to.equal("Out of Stock");
												else expect(res.body[i].stockStatus).to.equal("In Stock");
											}
											done();
										});
								}, 11000); 
							});
					});
			});
	}).timeout(15000);;
});
