import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: {
		type: String,
		unique: true,
		required: true,
	},
	role: {
		type: String,
		default: "user",
	},
	resetAttempts: {
		type: Number,
		default: 0,
	},
	resetLocked: {
		type: Boolean,
		default: false,
	},
	// User quotas and limits
	quotas: {
		maxOrdersPerDay: {
			type: Number,
			default: 10,
		},
		maxProductsPerOrder: {
			type: Number,
			default: 50,
		},
		maxTotalOrderValue: {
			type: Number,
			default: 10000, // in currency units
		},
	},
	// Usage tracking
	usage: {
		ordersToday: {
			type: Number,
			default: 0,
		},
		lastOrderDate: {
			type: Date,
			default: null,
		},
	},
});

export default mongoose.model("User", UserSchema);
