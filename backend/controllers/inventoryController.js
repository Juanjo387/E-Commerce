import Inventory from "../models/inventory.js";

export const getAllInventory = async (req, res) => {
    try {
      const inventory = await Inventory.find().populate("productId");
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  export const getInventory = async (req, res) => {
    try {
      const { productId } = req.params;
      const inventory = await Inventory.findOne({ productId }).populate("productId");
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  export const updateInventory = async (req, res) => {
    try {
      const { inventory } = req.body;
  
      const updatedInventory = await Promise.all(
        inventory.map(async (item) => {
          const { productId, quantity } = item;
  
          const updatedItem = await Inventory.findOneAndUpdate(
            { productId },
            { $set: { quantity } },
            { new: true, upsert: true }
          );
  
          return updatedItem;
        })
      );
  
      res.status(200).json(updatedInventory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
