import { generateBaseURL } from "./utils.js";

let PRODUCTS = []; // Define a variable to store the products

async function getProducts() {
	try {
		const baseURL = generateBaseURL();
		const response = await fetch(`${baseURL}/api/products`);

		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.statusText}`);
		}

		const productsData = await response.json();

		// Transform and populate the products
		const populatedProducts = productsData.map((productData) => ({
			id: productData._id,
			sNo: productData.sNo,
			name: productData.name,
			price: productData.price,
		}));

		PRODUCTS = populatedProducts;

		// Assign the populated products to the variable
	} catch (error) {
		console.error("Error retrieving products:", error);
	}
}

getProducts();

export { PRODUCTS, getProducts };
