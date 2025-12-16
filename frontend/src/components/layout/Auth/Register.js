import React, { useState } from "react";
import toast from "react-hot-toast";
import { generateBaseURL } from "../../../utils.js";

const Register = () => {

	return (
		<div className="form-container ">
			<form>
				<h4 className="title">REGISTER</h4>
				<div className="mb-3">
					<input
						type="text"
						data-testid="register-name"
						className="form-control"
						id="exampleInputEmail1"
						placeholder="Enter Your Name"
						required
						autoFocus
					/>
				</div>
				<div className="mb-3">
					<input
						type="text"
						data-testid="register-email"
						className="form-control"
						id="exampleInputEmail1"
						placeholder="Enter Your Email"
						required
					/>
				</div>
				<div className="mb-3">
					<input
						type="password"
						data-testid="register-password"
						className="form-control"
						id="exampleInputPassword1"
						placeholder="Enter Your Password"
						required
					/>
				</div>
				<button type="submit" data-testid="register-btn" className="btn btn-primary">
					REGISTER
				</button>
			</form>
		</div>
	);
};

export default Register;
