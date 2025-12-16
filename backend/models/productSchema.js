import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	sNo: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tags: {
		type: String,
		required: true,
	},
	ratings: {
		type: Map,
		of: Number,
		default: {},
	},
	stockStatus: {
		type: String,
		default: "In Stock",
	},
	variants: {
		type: Array,
		default: [],
	},
});

export default mongoose.model("Product", productSchema);
