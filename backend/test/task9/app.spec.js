/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Feature Testing", () => {
	it("Correctly handling the addition of review if user has not purchased", (done) => {
		let reviewData = {
			userId: "",
			username: "",
			productId: "",
			comment: "nice product!",
			option: "good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

		const loginCre = {
			email: "user@mail.com",
			password: "user123",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
						reviewData.username = res.body.user.username;
						chai.request(app)
							.post("/api/reviews")
							.send(reviewData)
							.end((err, res) => {
								expect(res).to.have.status(403);
								expect(res.body.error).to.deep.equal(
									"User has not purchased this product",
								);
								done();
							});
					});
			});
	});
	it("Correctly handling the addition of review if user has purchased the product", (done) => {
		let reviewData = {
			userId: "",
			username: "",
			productId: "",
			comment: "nice product!",
			option: "good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

		let orderData = {
			username: "",
			totalAmount: 999,
			products: [
				{
					id: "",
					sNo: 1,
					name: "myPhone",
					price: 999,
				},
			],
			address: "",
			payment: {},
		};

		const loginCre = {
			email: "user@mail.com",
			password: "user123",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
				orderData.products[0].id = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
						reviewData.username = res.body.user.username;
						orderData.username = res.body.user.username;
						chai.request(app)
							.post("/api/orders")
							.send(orderData)
							.end((err, res) => {
								chai.request(app)
									.post("/api/reviews")
									.send(reviewData)
									.end((err, res) => {
										expect(res).to.have.status(201);
										chai.request(app)
											.get(
												`/api/reviews/user/${reviewData.userId}/product/${reviewData.productId}`,
											)
											.end((err, res) => {
												expect(res).to.have.status(200);
												expect(res.body)
													.to.have.property("userId")
													.to.equal(
														reviewData.userId,
													);
												expect(res.body)
													.to.have.property(
														"productId",
													)
													.to.equal(
														reviewData.productId,
													);
												expect(res.body)
													.to.have.property("comment")
													.to.equal(
														reviewData.comment,
													);
												expect(res.body)
													.to.have.property("option")
													.to.equal(
														reviewData.option,
													);
												expect(res.body)
													.to.have.property("photo")
													.to.equal(reviewData.photo);
												done();
											});
									});
							});
					});
			});
	});

	it("Correctly handling the addition of new review if a review already exists", (done) => {
		let reviewData = {
			userId: "",
			username: "",
			productId: "",
			comment: "nice product!",
			option: "good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

		const loginCre = {
			email: "user@mail.com",
			password: "user123",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
						reviewData.username = res.body.user.username;
						chai.request(app)
							.post("/api/reviews")
							.send(reviewData)
							.end((err, res) => {
								expect(res).to.have.status(400);
								expect(res.body.error).to.deep.equal(
									"Review already exists",
								);
								done();
							});
					});
			});
	});

	it("Correctly handling the update of existing review", (done) => {
		let reviewData = {
			userId: "",
			productId: "",
			comment: "nice product!",
			option: "good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

		let updateData = {
			userId: "",
			productId: "",
			comment: "best product!",
			option: "great",
			photo: "",
		};

		const loginCre = {
			email: "user@mail.com",
			password: "user123",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
				updateData.productId = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
						updateData.userId = res.body.user.id;
						chai.request(app)
							.put("/api/reviews")
							.send(updateData)
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body)
									.to.have.property("userId")
									.to.equal(updateData.userId);
								expect(res.body)
									.to.have.property("productId")
									.to.equal(updateData.productId);
								expect(res.body)
									.to.have.property("comment")
									.to.equal(updateData.comment);
								expect(res.body)
									.to.have.property("option")
									.to.equal(updateData.option);
								expect(res.body)
									.to.have.property("photo")
									.to.equal(updateData.photo);
								chai.request(app)
									.get(
										`/api/reviews/user/${reviewData.userId}/product/${reviewData.productId}`,
									)
									.end((err, res) => {
										expect(res).to.have.status(200);
										expect(res.body)
											.to.have.property("userId")
											.to.equal(updateData.userId);
										expect(res.body)
											.to.have.property("productId")
											.to.equal(updateData.productId);
										expect(res.body)
											.to.have.property("comment")
											.to.equal(updateData.comment);
										expect(res.body)
											.to.have.property("option")
											.to.equal(updateData.option);
										expect(res.body)
											.to.have.property("photo")
											.to.equal(updateData.photo);
										done();
									});
							});
					});
			});
	});

	it("Correctly handling the update limit", (done) => {
		let reviewData = {
			userId: "",
			productId: "",
			comment: "nice product!",
			option: "good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

		let updateData = {
			userId: "",
			productId: "",
			comment: "amazing product!",
			option: "good",
			photo: "",
		};

		const loginCre = {
			email: "user@mail.com",
			password: "user123",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
				updateData.productId = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
						updateData.userId = res.body.user.id;
						chai.request(app)
							.put("/api/reviews")
							.send(updateData)
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body)
									.to.have.property("userId")
									.to.equal(updateData.userId);
								expect(res.body)
									.to.have.property("productId")
									.to.equal(updateData.productId);
								expect(res.body)
									.to.have.property("comment")
									.to.equal(updateData.comment);
								expect(res.body)
									.to.have.property("option")
									.to.equal(updateData.option);
								expect(res.body)
									.to.have.property("photo")
									.to.equal(updateData.photo);
								chai.request(app)
									.put("/api/reviews")
									.send(updateData)
									.end((err, res) => {
										expect(res).to.have.status(429);
										done();
									});
							});
					});
			});
	});

	it("Correctly handling the average rating of all users", (done) => {
		let reviewData = {
			userId: "",
			username: "",
			productId: "",
			comment: "I did not like it",
			option: "not good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

		let orderData = {
			username: "",
			totalAmount: 999,
			products: [
				{
					id: "",
					sNo: 1,
					name: "myPhone",
					price: 999,
				},
			],
			address: "",
			payment: {},
		};

		const loginCre = {
			email: "user2@mail.com",
			password: "user1234",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
				orderData.products[0].id = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
						reviewData.username = res.body.user.username;
						orderData.username = res.body.user.username;
						chai.request(app)
							.post("/api/orders")
							.send(orderData)
							.end((err, res) => {
								chai.request(app)
									.post("/api/reviews")
									.send(reviewData)
									.end((err, res) => {
										expect(res).to.have.status(201);
										chai.request(app)
											.get(
												`/api/reviews/user/${reviewData.userId}/product/${reviewData.productId}`,
											)
											.end((err, res) => {
												expect(res).to.have.status(200);
												expect(res.body)
													.to.have.property("userId")
													.to.equal(
														reviewData.userId,
													);
												expect(res.body)
													.to.have.property(
														"productId",
													)
													.to.equal(
														reviewData.productId,
													);
												expect(res.body)
													.to.have.property("comment")
													.to.equal(
														reviewData.comment,
													);
												expect(res.body)
													.to.have.property("option")
													.to.equal(
														reviewData.option,
													);
												expect(res.body)
													.to.have.property("photo")
													.to.equal(reviewData.photo);
												chai.request(app)
													.get(
														`/api/reviews/average/${reviewData.productId}`,
													)
													.end((err, res) => {
														expect(res,).to.have.status(200);
														expect(res.body)
															.to.have.property(
																"averageReview",
															)
															.to.equal(
																"average",
															);
														done();
													});
											});
									});
							});
					});
			});
	});

    it("Correctly handling the delete operation", (done) => {
		let reviewData = {
			userId: "",
			productId: "",
			comment: "I did not like it",
			option: "not good",
			photo: "https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png",
		};

        let deleteData = {
            userId: "",
			productId: "",
        }

		const loginCre = {
			email: "user2@mail.com",
			password: "user1234",
		};

		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				reviewData.productId = res.body[0]._id;
                deleteData.productId = res.body[0]._id;
				chai.request(app)
					.post("/api/auth/login")
					.send(loginCre)
					.end((err, res) => {
						reviewData.userId = res.body.user.id;
                        deleteData.userId = res.body.user.id;
						chai.request(app)
							.delete("/api/reviews")
                            .send(deleteData)
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body.message).to.deep.equal(
									"Review deleted successfully",
								);
								chai.request(app)
									.get(
										`/api/reviews/user/${reviewData.userId}/product/${reviewData.productId}`,
									)
									.end((err, res) => {
										expect(res).to.have.status(200);
                                        expect(res.body).to.be.null;	
										done();
									});
							});
					});
			});
	});
});
