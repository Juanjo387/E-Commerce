import cron from "node-cron";
import connectDatabase from "../config/database.js";
import fs from "fs";

const backupDatabase = async () => {
    try {
        const db = await connectDatabase();
        const productCollection = db.collection("products");
        const orderCollection = db.collection("orders");

        const productsBackupCollection = db.collection("products_backup");
        const ordersBackupCollection = db.collection("orders_backup");

        const products = await productCollection.find({}).toArray();
        const productCount = await productsBackupCollection.countDocuments();
        let productLog = "Product database: ";

        if (products.length > productCount) {
            productLog += "Add more data";
            await productsBackupCollection.deleteMany({});
            await productsBackupCollection.insertMany(products);
        } else if (products.length < productCount) {
            productLog += "Reduce data";
        } else {
            productLog += "No changes";
        }

        const orders = await orderCollection.find({}).toArray();
        const orderCount = await ordersBackupCollection.countDocuments();
        let orderLog = "Order database: ";

        if (orders.length > orderCount) {
            orderLog += "Add more data";
            await ordersBackupCollection.deleteMany({});
            await ordersBackupCollection.insertMany(orders);
        } else if (orders.length < orderCount) {
            orderLog += "Reduce data";
        } else {
            orderLog += "No changes";
        }

        const logEntry = `Backup Report (${new Date().toISOString()}):\n${productLog}\n${orderLog}\n\n`;
        fs.appendFileSync('backup.log', logEntry, 'utf8');

    } catch (error) {
        console.error("Error during backup:", error);
    }
};

cron.schedule("*/2 * * *", backupDatabase);
