/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";
import { exec } from "child_process";

chai.use(chaiHttp);
const { expect } = chai;

describe("Update User Profile Testing", () => {
	it("should return 404 error for non existent user on PUT user profile", (done) => {
		const data = {
			email: "user99@mail.com",
			username: "testUser",
			phone: "9876543212",
			address: "Sample Address",
			dob: "2026-05-23",
		};
		chai.request(app)
			.put("/api/auth/profile")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body)
					.to.have.property("error")
					.to.deep.equal("User doesn't exist");
				done();
			});
	});

	it("should return 400 error when username is empty on PUT user profile", (done) => {
		const data = {
			email: "user2@mail.com",
			username: "",
			phone: "9876543212",
			address: "Sample Address",
			dob: "2026-05-23",
		};
		chai.request(app)
			.put("/api/auth/profile")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body)
					.to.have.property("error")
					.to.deep.equal("Username cannot be empty");
				done();
			});
	});

	it("should successfully update user profile and reflect changes on GET user profile", (done) => {
		const data = {
			email: "user2@mail.com",
			username: "testUser",
			phone: "9876543212",
			address: "Sample Address",
			dob: "2026-05-23",
		};
		chai.request(app)
			.put("/api/auth/profile")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body)
					.to.have.property("message")
					.to.deep.equal("Profile updated successfully");
				chai.request(app)
					.get("/api/auth/profile/user2@mail.com")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body)
							.to.have.property("username")
							.to.deep.equal("testUser");
						expect(res.body)
							.to.have.property("email")
							.to.deep.equal("user2@mail.com");
						expect(res.body)
							.to.have.property("address")
							.to.deep.equal("Sample Address");
						expect(res.body)
							.to.have.property("phone")
							.to.deep.equal("9876543212");
						expect(res.body).to.have.property("dob");
						done();
					});
			});
	});

	it("should store date of birth in the correct format in the database", (done) => {
		chai.request(app)
			.get("/api/auth/profile/user2@mail.com")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body)
					.to.have.property("dob")
					.to.deep.equal("23-05-2026");
				done();
			});
	});

	it("should retain correct date of birth format when provided format is already correct", (done) => {
		const data = {
			email: "user2@mail.com",
			username: "testUser2",
			phone: "9876543219",
			address: "Sample Address 2",
			dob: "25-05-2026",
		};
		chai.request(app)
			.put("/api/auth/profile")
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body)
					.to.have.property("message")
					.to.deep.equal("Profile updated successfully");
				chai.request(app)
					.get("/api/auth/profile/user2@mail.com")
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body)
							.to.have.property("username")
							.to.deep.equal("testUser2");
						expect(res.body)
							.to.have.property("email")
							.to.deep.equal("user2@mail.com");
						expect(res.body)
							.to.have.property("address")
							.to.deep.equal("Sample Address 2");
						expect(res.body)
							.to.have.property("phone")
							.to.deep.equal("9876543219");
						expect(res.body).to.have.property("dob").to.deep.equal("25-05-2026");
						done();
					});
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
