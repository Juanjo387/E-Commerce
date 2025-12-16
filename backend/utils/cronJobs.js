import cron from "node-cron";
import Inventory from "../models/inventorySchema.js";
import Product from "../models/productSchema.js";

cron.schedule("*/10 * * * *", async () => {
  const inventories = await Inventory.find();
  inventories.forEach(async (inventory) => {
    const product = await Product.findById(inventory.productId);
    product.stockStatus = inventory.quantity > 0 ? "In Stock" : "Out of Stock";
    await product.save();
  });
});