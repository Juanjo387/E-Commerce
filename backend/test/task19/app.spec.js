/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import { exec } from "child_process";

chai.use(chaiHttp);
const { expect } = chai;

describe("Feature Testing", () => {
	it("should return an empty array for FAQs when no FAQs are saved in the database", (done) => {
		let id = "";
		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				id = res.body[2]._id;

				chai.request(app)
					.get(`/api/products/faqs/${id}`)
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.deep.equal([]);
						done();
					});
			});
	});

	it("should return the correct success message and status code when saving FAQs to the database", (done) => {
		chai.request(app)
			.post("/api/products/faqs/save")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body)
					.to.have.property("message")
					.to.deep.equal("FAQs saved successfully");
				done();
			});
	});

	it("should ensure FAQs for all products are stored in the correct format in the database", (done) => {
		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				expect(res).to.have.status(200);
				res.body.forEach((product) => {
					expect(product)
						.to.have.property("faqs")
						.that.is.an("array")
						.with.lengthOf(5);
				});
				expect(res.body[2].faqs).to.deep.equal([
					{
						question: "What is the screen resolution?",
						answer: "The resolution is 3840 x 2160 pixels.",
					},
					{
						question: "What ports does it have?",
						answer: "It has HDMI, USB, and Ethernet ports.",
					},
					{
						question: "Does it support HDR?",
						answer: "Yes, it supports HDR10.",
					},
					{
						question: "What is the refresh rate?",
						answer: "The refresh rate is 60Hz.",
					},
					{
						question: "Is it a smart TV?",
						answer: "Yes, it has built-in smart features.",
					},
				]);
				done();
			});
	});

	it("should return an error message for an invalid product ID", (done) => {
		let id = "68000a2000b96b7e4dc70dbf";
		chai.request(app)
			.get(`/api/products/faqs/${id}`)
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body)
					.to.have.property("error")
					.to.deep.equal("Product not found");
				done();
			});
	});
});

after((done) => {
	exec("node utils/seed.js", (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing seed script: ${error.message}`);
			return done(error);
		}
		done();
	});
});
