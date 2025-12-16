/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";

chai.use(chaiHttp);
const { expect } = chai;
let pin = "";

describe("BugFix Testing", () => {
	it("User does not exist validation is correct", (done) => {
		let resetData = {
			email: "user5@mail.com",
			oldPassword: "user123",
			newPassword: "User@123",
			confirmNewPassword: "User@123",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.text).to.equal("User does not exist");
				done();
			});
	});

	it("Invalid old password validation is correct", (done) => {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "user1234",
			newPassword: "User@123",
			confirmNewPassword: "User@123",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.text).to.equal("Invalid old password");
				done();
			});
	});

	it("New passwords do not match validation is correct", (done) => {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "user123",
			newPassword: "User@1234",
			confirmNewPassword: "User@123",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.text).to.equal("New passwords do not match");
				done();
			});
	});

	it("New passwords regex validation is correct", (done) => {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "user123",
			newPassword: "user@123",
			confirmNewPassword: "user@123",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.text).to.equal(
					"New password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.",
				);
				resetData.newPassword = "Users123";
				resetData.confirmNewPassword = "Users123";
				chai.request(app)
					.post("/api/auth/password-reset/initiate")
					.send(resetData)
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.text).to.equal(
							"New password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.",
						);
						resetData.newPassword = "User@user";
						resetData.confirmNewPassword = "User@user";
						chai.request(app)
							.post("/api/auth/password-reset/initiate")
							.send(resetData)
							.end((err, res) => {
								expect(res).to.have.status(400);
								expect(res.text).to.equal(
									"New password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.",
								);
								resetData.newPassword = "User@12";
								resetData.confirmNewPassword = "User@12";
								chai.request(app)
									.post("/api/auth/password-reset/initiate")
									.send(resetData)
									.end((err, res) => {
										expect(res).to.have.status(400);
										expect(res.text).to.equal(
											"New password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.",
										);
										resetData.newPassword = "User@123";
										resetData.confirmNewPassword =
											"User@123";
										chai.request(app)
											.post(
												"/api/auth/password-reset/initiate",
											)
											.send(resetData)
											.end((err, res) => {
												expect(res).to.have.status(200);
												expect(res.text).to.not.equal(
													"New password must be least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.",
												);
												pin = res.text.split(": ")[1];
												done();
											});
									});
							});
					});
			});
	});

	it("OTP generation and validation is correct", (done) => {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "user123",
			newPassword: "User@123",
			confirmNewPassword: "User@123",
		};

		let verifyData = {
			email: "user@mail.com",
			OTP: "1234",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(200);
				const OTP = res.text.split(": ")[1];
				expect(res.text).to.equal(
					`Password reset OTP for user@mail.com: ${OTP}`,
				);
				expect(OTP).to.match(/^\d{4}$/);
				expect(OTP).to.not.equal(pin);
				chai.request(app)
					.post("/api/auth/password-reset/verify")
					.send(verifyData)
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.text).to.equal("Invalid or expired OTP");
						done();
					});
			});
	});

	it("OTP expiration is handled correctly", function (done) {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "user123",
			newPassword: "User@123",
			confirmNewPassword: "User@123",
		};

		let verifyData = {
			email: "user@mail.com",
			OTP: "",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(200);
				const OTP = res.text.split(": ")[1];
				expect(res.text).to.equal(
					`Password reset OTP for user@mail.com: ${OTP}`,
				);
				expect(OTP).to.match(/^\d{4}$/);
				verifyData.OTP = OTP;
				setTimeout(() => {
					chai.request(app)
						.post("/api/auth/password-reset/verify")
						.send(verifyData)
						.end((err, res) => {
							expect(res).to.have.status(400);
							expect(res.text).to.equal(
								"Invalid or expired OTP",
							);
							done();
						});
				}, 16000);
			});
	}).timeout(20000);

	it("Password reset is working correctly", function (done) {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "user123",
			newPassword: "User@123",
			confirmNewPassword: "User@123",
		};

		let verifyData = {
			email: "user@mail.com",
			OTP: "",
		};

		let updateData = {
			email: "user@mail.com",
			newPassword: "User@123",
		};

		let loginCre = {
			email: "user@mail.com",
			password: "user123",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(200);
				const OTP = res.text.split(": ")[1];
				expect(res.text).to.equal(
					`Password reset OTP for user@mail.com: ${OTP}`,
				);
				expect(OTP).to.match(/^\d{4}$/);
				verifyData.OTP = OTP;
				chai.request(app)
					.post("/api/auth/password-reset/verify")
					.send(verifyData)
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.text).to.equal("OTP is valid");
						chai.request(app)
							.post("/api/auth/password-reset/update")
							.send(updateData)
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.text).to.equal(
									"Password reset successfully",
								);
								chai.request(app)
									.post("/api/auth/login")
									.send(loginCre)
									.end((err, res) => {
										expect(res).to.have.status(400);
										expect(res.body.error).to.equal(
											"Invalid password",
										);
										loginCre.password =
											updateData.newPassword;
										chai.request(app)
											.post("/api/auth/login")
											.send(loginCre)
											.end((err, res) => {
												expect(res).to.have.status(200);
												expect(
													res.body.success,
												).to.equal("Login Successful");
												done();
											});
									});
							});
					});
			});
	});

	it("Password reset locking is working correctly", (done) => {
		let resetData = {
			email: "user@mail.com",
			oldPassword: "User@123",
			newPassword: "User@12345",
			confirmNewPassword: "User@12345",
		};

		let verifyData = {
			email: "user@mail.com",
			OTP: "1234",
		};

		chai.request(app)
			.post("/api/auth/password-reset/initiate")
			.send(resetData)
			.end((err, res) => {
				expect(res).to.have.status(200);
				const OTP = res.text.split(": ")[1];
				expect(res.text).to.equal(
					`Password reset OTP for user@mail.com: ${OTP}`,
				);
				expect(OTP).to.match(/^\d{4}$/);
				chai.request(app)
					.post("/api/auth/password-reset/verify")
					.send(verifyData)
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.text).to.equal("Invalid or expired OTP");
						chai.request(app)
							.post("/api/auth/password-reset/verify")
							.send(verifyData)
							.end((err, res) => {
								expect(res).to.have.status(400);
								expect(res.text).to.equal(
									"Invalid or expired OTP",
								);
								chai.request(app)
									.post("/api/auth/password-reset/verify")
									.send(verifyData)
									.end((err, res) => {
										expect(res).to.have.status(400);
										expect(res.text).to.equal(
											"Invalid or expired OTP",
										);
										chai.request(app)
											.post(
												"/api/auth/password-reset/verify",
											)
											.send(verifyData)
											.end((err, res) => {
												expect(res).to.have.status(400);
												expect(res.text).to.equal(
													"Password reset is temporarily locked. Please try again later.",
												);
                                                verifyData.OTP = OTP;
												chai.request(app)
													.post(
														"/api/auth/password-reset/verify",
													)
													.send(verifyData)
													.end((err, res) => {
														expect(
															res,
														).to.have.status(400);
														expect(
															res.text,
														).to.equal(
															"Password reset is temporarily locked. Please try again later.",
														);
														done();
													});
											});
									});
							});
					});
			});
	});
});
