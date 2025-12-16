import { MongoClient } from "mongodb";

const connectionString =
	process.env.MONGODB_URI ||
	"mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&";

async function connectDatabase() {
	const client = new MongoClient(connectionString);

	try {
		await client.connect();
		return client.db("Ecommerce");
	} catch (e) {
		console.error(e);
	}
}

export default connectDatabase;
