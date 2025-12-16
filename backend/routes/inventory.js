import express from "express";
import {
  updateInventory,
  getAllInventory,
  getInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/update", updateInventory);
router.get("/all", getAllInventory);
router.get("/:productId", getInventory);

export default router;