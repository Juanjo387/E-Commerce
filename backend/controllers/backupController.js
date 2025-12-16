import connectDatabase from "../config/database.js";

export const getAllBackupProducts = async (req, res) => {
    try {
        const db = await connectDatabase();
        const backupCollection = db.collection("products_backup");
        const products = await backupCollection.find({}).toArray();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching backup products:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAllBackupOrders = async (req, res) => {
    try {
        const db = await connectDatabase();
        const backupCollection = db.collection("orders_backup");
        const orders = await backupCollection.find({}).toArray();
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching backup orders:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const addBackupProduct = async (req, res) => {
    try {
        const db = await connectDatabase();
        const backupCollection = db.collection("products_backup");
        const newProduct = req.body; 
        await backupCollection.insertOne(newProduct);
        res.status(201).json({ message: "Product added to backup successfully" });
    } catch (error) {
        console.error("Error adding product to backup:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const addBackupOrder = async (req, res) => {
    try {
        const db = await connectDatabase();
        const backupCollection = db.collection("orders_backup");
        const newOrder = req.body;
        await backupCollection.insertOne(newOrder);
        res.status(201).json({ message: "Order added to backup successfully" });
    } catch (error) {
        console.error("Error adding order to backup:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateBackupProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updatedData = req.body;
        const db = await connectDatabase();
        const backupCollection = db.collection("products_backup");
        const result = await backupCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: updatedData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Product not found in backup" });
        }

        res.status(200).json({ message: "Product updated in backup successfully" });
    } catch (error) {
        console.error("Error updating product in backup:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateBackupOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const updatedData = req.body;
        const db = await connectDatabase();
        const backupCollection = db.collection("orders_backup");
        const result = await backupCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: updatedData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Order not found in backup" });
        }

        res.status(200).json({ message: "Order updated in backup successfully" });
    } catch (error) {
        console.error("Error updating order in backup:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteBackupProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const db = await connectDatabase();
        const backupCollection = db.collection("products_backup");
        const result = await backupCollection.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found in backup" });
        }

        res.status(200).json({ message: "Product deleted from backup successfully" });
    } catch (error) {
        console.error("Error deleting product from backup:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteBackupOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const db = await connectDatabase();
        const backupCollection = db.collection("orders_backup");
        const result = await backupCollection.deleteOne({ _id: new ObjectId(orderId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Order not found in backup" });
        }

        res.status(200).json({ message: "Order deleted from backup successfully" });
    } catch (error) {
        console.error("Error deleting order from backup:", error);
        res.status(500).json({ error: "Server error" });
    }
};
