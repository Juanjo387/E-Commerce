import React from "react";
import UserMenu from "./UserMenu";
import "./AddressManager.css";

function AddressManager() {
	return (
		<div className="container-fluid p-3 m-3">
			<div className="row">
				<div className="col-md-3">
					<UserMenu />
				</div>
				<div className="col-md-9">
					<div className="address-manager-container">
						<div>
							<h3 className="save-address-heading">
								Saved Addresses
							</h3>
							<ul disabled className="address-list" >
								<li className="address-item">
									<p data-testid="addr-street">Street:</p>
									<p data-testid="addr-city">City:</p>
									<p data-testid="addr-state">State:</p>
									<p data-testid="addr-zipCode">ZIP Code:</p>
									<button
										data-testid="addr-edit"
										className="save-address-btns"
									>
										Edit
									</button>
									<button
										data-testid="addr-delete"
										className="save-address-btns"
									>
										Delete
									</button>
								</li>
							</ul>
							<p data-testid="no-addr" className="no-saved-addr">
								No saved addresses yet.
							</p>

							<button
								data-testid="addr-btn"
								className="btn btn-primary address-form-btn"
							>
								Add New Address
							</button>
						</div>
						<div disabled> 
							<h2 className="manage-address-heading">
								Manage Address
							</h2>
							<form className="address-form">
								<div className="mb-3">
									<label
										htmlFor="street"
										className="form-label"
									>
										Street:
									</label>
									<input
										type="text"
										data-testid="addr-street"
										className="form-control"
										id="street"
										name="street"
									/>
								</div>
								<div className="mb-3">
									<label
										htmlFor="city"
										className="form-label"
									>
										City:
									</label>
									<input
										type="text"
										data-testid="addr-city"
										className="form-control"
										id="city"
										name="city"
									/>
								</div>
								<div className="mb-3">
									<label
										htmlFor="state"
										className="form-label"
									>
										State:
									</label>
									<input
										type="text"
										data-testid="addr-state"
										className="form-control"
										id="state"
										name="state"
									/>
								</div>
								<div className="mb-3">
									<label
										htmlFor="zipCode"
										className="form-label"
									>
										ZIP Code:
									</label>
									<input
										type="text"
										data-testid="addr-zipCode"
										className="form-control"
										id="zipCode"
										name="zipCode"
									/>
								</div>
								<button
									data-testid="addr-btn"
									type="submit"
									className="btn btn-primary"
								>
									Update Address
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddressManager;
