import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
	{
		cardNumber: {
			type: String,
			required: true,
		},
		expiryDate: {
			type: String,
			required: true,
		},
		cvv: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const addressSchema = new mongoose.Schema(
	{
		street: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zipCode: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const orderSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		payment: {
			type: paymentSchema,
			required: true,
		},
		address: {
			type: addressSchema,
			required: true,
		},
		status: {
			type: String,
			enum: ["PENDING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"],
			default: "LOADING",
		},
		trackingNumber: {
			type: String,
			default: "", 
		},
		shippingCarrier: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
