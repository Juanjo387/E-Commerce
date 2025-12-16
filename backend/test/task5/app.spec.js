/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";  

chai.use(chaiHttp);
const { expect } = chai;

describe("Product API Testing", () => {

	it("return 400 error if less than 3 tags are provided", (done) => {
		const productData = {
			name: "sampleProduct",
			price: 89,
			description: "The latest product",
			tags: "tag1"
		};

		chai.request(app)
			.post("/api/products/")
			.send(productData)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property("error").to.equal("At least 3 tags are required");
				done();
			});
	});

	it("create a new product successfully", (done) => {
		const productData = {
			name: "sampleProduct",
			price: 89,
			description: "The latest product",
			tags: "tag1, tag2, tag3"
		};

		chai.request(app)
			.post("/api/products/")
			.send(productData)
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.not.have.property("error");
				expect(res.body).to.not.be.empty;
				expect(res.body).to.have.property("acknowledged").to.equal(true);
				done();
			});
	});

	it("store tags as an array of strings in the database without extra spaces", (done) => {
		const productData = {
			name: "sampleProduct2",
			price: 99,
			description: "The latest product2",
			tags: "tag1, tag2, tag3"
		};

		chai.request(app)
			.post("/api/products/")
			.send(productData)
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.not.have.property("error");
				expect(res.body).to.not.be.empty;
				expect(res.body).to.have.property("acknowledged").to.equal(true);
				chai.request(app)
					.get("/api/products")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body[res.body.length - 1]).to.have.property("name").to.equal("sampleProduct2");
						expect(res.body[res.body.length - 1]).to.have.property("price").to.equal(99);
						expect(res.body[res.body.length - 1]).to.have.property("description").to.equal("The latest product2");
						expect(res.body[res.body.length - 1]).to.have.property("tags").that.is.an("array").that.deep.equals(["tag1", "tag2", "tag3"]);
						done(); 
					})
			});
	});

	it("create all new products with a unique serial number that does not match existing products", (done) => {
		const productData = {
			name: "sampleProduct3",
			price: 79,
			description: "The latest product3",
			tags: "tag1, tag2, tag3"
		};

		chai.request(app)
			.post("/api/products/")
			.send(productData)
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.not.have.property("error");
				expect(res.body).to.not.be.empty;
				expect(res.body).to.have.property("acknowledged").to.equal(true);
				chai.request(app)
					.get("/api/products")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body[res.body.length - 1]).to.have.property("sNo");
						const newProduct = res.body[res.body.length - 1];
						const sNo = newProduct.sNo;
						expect(sNo).to.be.a('number');
						expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).to.not.include(sNo);
						expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).to.not.include(res.body[10].sNo);
						expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).to.not.include(res.body[11].sNo);
						expect(sNo).to.not.equal(res.body[10].sNo);
						expect(sNo).to.not.equal(res.body[11].sNo);
						expect(res.body[10].sNo).to.not.equal(res.body[11].sNo);
						done(); 
					})
			});
	});

	it("delete existent product successfully",  (done) => {
		let id = "";
		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				id = res.body[0]._id;
        
				chai.request(app)
					.delete(`/api/products/${id}`) 
					.end((err, res) => {
						chai.request(app)
							.get("/api/products")
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body[0]).to.have.property("name").to.not.equal("myPhone");
								expect(res.body[0]).to.have.property("price").to.not.equal(999);
								expect(res.body[0]).to.have.property("description").to.not.equal("The latest phone with advanced features");
								done(); 
							})
					});
			});  
	});

	it("return 404 error with Product not found message for deleting non existent product", (done) => {
		let id = "67e3f1f3c379995ed9728302";
        
		chai.request(app)
			.delete(`/api/products/${id}`) 
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.not.be.empty;
				expect(res.body).to.have.property("error").to.equal("Product not found");
				done();
			});
	});
});
