/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import { exec } from "child_process";

chai.use(chaiHttp);
const { expect } = chai;

describe("Bulk Upload Products Testing", () => {
	it("should return the correct available CSV files for upload on GET /csv-files", (done) => {
		chai.request(app)
			.get("/api/products/csv-files")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an("array").that.has.lengthOf(4);
				expect(res.body).to.deep.equal([
					"products1.csv",
					"products2.csv",
					"products3.csv",
					"products4.csv",
				]);
				done();
			});
	});

	it("should return a success message and the number of added products on successful bulk upload", (done) => {
		const data = {
			fileName: "products1.csv",
		};

		chai.request(app)
			.post("/api/products/bulk-upload")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body)
					.to.have.property("message")
					.to.equal("Products uploaded successfully");
				expect(res.body)
					.to.have.property("added")
					.to.equal(3);
				done();
			});
	});

	it("should save the uploaded products to the database in the correct format", (done) => {
		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an("array").that.has.lengthOf(13);

				const expectedProducts = [
					{
						name: "Product1",
						price: "100",
						description: "Description1",
						tags: "Tag1",
						sNo: 11,
					},
					{
						name: "Product2",
						price: "200",
						description: "Description2",
						tags: "Tag2",
						sNo: 12,
					},
					{
						name: "Product3",
						price: "300",
						description: "Description3",
						tags: "Tag3",
						sNo: 13,
					},
				];

				expectedProducts.forEach((expectedProduct) => {
					const foundProduct = res.body.find(
						(product) =>
							product.name === expectedProduct.name &&
							product.price === expectedProduct.price &&
							product.description === expectedProduct.description &&
							product.tags === expectedProduct.tags &&
							product.sNo === expectedProduct.sNo,
					);
					expect(foundProduct).to.exist;
				});
				done();
			});
	});

	it("should return an error message when attempting to bulk upload a non existent file", (done) => {
		const data = {
			fileName: "products5.csv",
		};

		chai.request(app)
			.post("/api/products/bulk-upload")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body)
					.to.have.property("error")
					.to.equal("File does not exist");
				done();
			});
	});

	it("should handle overlapping products correctly and not add duplicates during bulk upload", (done) => {
		const data = {
			fileName: "products4.csv",
		};

		chai.request(app)
			.post("/api/products/bulk-upload")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body)
					.to.have.property("message")
					.to.equal("Products uploaded successfully");
				expect(res.body).to.have.property("added").to.equal(3);
				chai.request(app)
					.get("/api/products")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body)
							.to.be.an("array")
							.that.has.lengthOf(16);

						const expectedProducts = [
							{
								name: "Product4",
								price: "400",
								description: "Description4",
								tags: "Tag4",
								sNo: 14,
							},
							{
								name: "Product10",
								price: "1000",
								description: "Description10",
								tags: "Tag10",
								sNo: 15,
							},
							{
								name: "Product11",
								price: "1100",
								description: "Description11",
								tags: "Tag11",
								sNo: 16,
							},
						];

						expectedProducts.forEach((expectedProduct) => {
							const foundProduct = res.body.find(
								(product) =>
									product.name === expectedProduct.name &&
									product.price === expectedProduct.price &&
									product.description === expectedProduct.description &&
									product.tags === expectedProduct.tags &&
									product.sNo === expectedProduct.sNo,
							);
							expect(foundProduct).to.exist;
						});
						done();
					});
			});
	});
});

after((done) => {
	exec('node utils/seed.js', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing seed script: ${error.message}`);
			return done(error);
		}
		done();
	});
});
