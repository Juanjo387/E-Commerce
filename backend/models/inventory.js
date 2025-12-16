import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default mongoose.model("Inventory", inventorySchema);