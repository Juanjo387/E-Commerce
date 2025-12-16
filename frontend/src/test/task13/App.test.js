import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import ProductComparison from "../../components/layout/User/ProductComparison";
import { MemoryRouter } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";
import { CurrencyProvider } from "../../../src/contexts/currencyContext";

jest.mock("../../../src/contexts/onAuth.js", () => ({
	useAuth: () => [
		{
			user: { username: "testUser" },
			token: "testToken",
			isLoading: false,
		},
		jest.fn(),
	],
}));

jest.mock("../../../src/products", () => ({
	PRODUCTS: [
		{
			id: "67030a8520a0a48b849558d2",
			sNo: 1,
			name: "myPhone",
			price: 999,
			description: "The latest phone with advanced features",
			tags: "electronics, smartphone, mobile",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d3",
			sNo: 2,
			name: "Galexy Fone 27",
			price: 799,
			description: "High-performance Android smartphone",
			tags: "electronics, smartphone, mobile",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d4",
			sNo: 3,
			name: "Super 4k TV 1",
			price: 1499,
			description: "Ultra HD Smart TV with stunning visuals",
			tags: "electronics, television, tv",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d5",
			sNo: 4,
			name: "Office Laptop 15",
			price: 1599,
			description: "Powerful laptop for professional use",
			tags: "electronics, laptop, computer",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d6",
			sNo: 5,
			name: "Air Sneakers 9",
			price: 129,
			description: "Stylish athletic shoes for everyday wear",
			tags: "footwear, sneakers, shoes",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d7",
			sNo: 6,
			name: "Ultra HD Camera",
			price: 3499,
			description: "High-resolution mirrorless camera",
			tags: "electronics, camera, photo",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d8",
			sNo: 7,
			name: "Super OLED TV X2",
			price: 1999,
			description: "Premium OLED TV with stunning picture quality",
			tags: "electronics, television, entertainment",
			stockStatus: "In Stock",
		},
		{
			id: "67030a8520a0a48b849558d9",
			sNo: 8,
			name: "Gaming Laptop 1",
			price: 1299,
			description: "Versatile convertible laptop for gaming",
			tags: "electronics, gaming, laptop",
			stockStatus: "In Stock",
		},
	],
	getProducts: jest.fn(),
}));

global.console.warn = jest.fn();
global.console.error = jest.fn();

describe("BugFix Testing", () => {
	beforeEach(() => {
		fetchMock.reset();
		jest.clearAllMocks();
	});

	it("Products have been correctly fetched & displayed", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
				{
					_id: "67030a8520a0a48b849558d2",
					sNo: 1,
					name: "myPhone",
					price: 999,
					description: "The latest phone with advanced features",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d3",
					sNo: 2,
					name: "Galexy Fone 27",
					price: 799,
					description: "High-performance Android smartphone",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d4",
					sNo: 3,
					name: "Super 4k TV 1",
					price: 1499,
					description: "Ultra HD Smart TV with stunning visuals",
					tags: "electronics, television, tv",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d5",
					sNo: 4,
					name: "Office Laptop 15",
					price: 1599,
					description: "Powerful laptop for professional use",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d6",
					sNo: 5,
					name: "Air Sneakers 9",
					price: 129,
					description: "Stylish athletic shoes for everyday wear",
					tags: "footwear, sneakers, shoes",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d7",
					sNo: 6,
					name: "Ultra HD Camera",
					price: 3499,
					description: "High-resolution mirrorless camera",
					tags: "electronics, camera, photo",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d8",
					sNo: 7,
					name: "Super OLED TV X2",
					price: 1999,
					description:
						"Premium OLED TV with stunning picture quality",
					tags: "electronics, television, entertainment",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d9",
					sNo: 8,
					name: "Gaming Laptop 1",
					price: 1299,
					description: "Versatile convertible laptop for gaming",
					tags: "electronics, gaming, laptop",
					stockStatus: "In Stock",
				},
			],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ProductComparison />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
		const product1Select = screen.getByTestId("product1-select");
		const option1 = product1Select.querySelectorAll("option");
		expect(option1[1].textContent).toBe("myPhone");
		expect(option1[2].textContent).toBe("Galexy Fone 27");
		expect(option1[3].textContent).toBe("Super 4k TV 1");
		expect(option1[4].textContent).toBe("Office Laptop 15");
		expect(option1[5].textContent).toBe("Air Sneakers 9");
		expect(option1[6].textContent).toBe("Ultra HD Camera");
		expect(option1[7].textContent).toBe("Super OLED TV X2");
		expect(option1[8].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(product1Select, {
			target: { value: "67030a8520a0a48b849558d5" },
		});

		const product2Select = screen.getByTestId("product2-select");
		const option2 = product2Select.querySelectorAll("option");
		expect(option2[1].textContent).toBe("myPhone");
		expect(option2[2].textContent).toBe("Galexy Fone 27");
		expect(option2[3].textContent).toBe("Super 4k TV 1");
		expect(option2[4].textContent).toBe("Office Laptop 15");
		expect(option2[5].textContent).toBe("Air Sneakers 9");
		expect(option2[6].textContent).toBe("Ultra HD Camera");
		expect(option2[7].textContent).toBe("Super OLED TV X2");
		expect(option2[8].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(product2Select, {
			target: { value: "67030a8520a0a48b849558d9" },
		});

		const product1Box = screen.getByTestId("product1-box");
		const product2Box = screen.getByTestId("product2-box");

		const img1 = product1Box.querySelector("img");
		expect(img1).toBeInTheDocument();
		const img2 = product2Box.querySelector("img");
		expect(img2).toBeInTheDocument();

		const h1 = product1Box.querySelector("h4");
		expect(h1.textContent).toBe("Office Laptop 15");
		const h2 = product2Box.querySelector("h4");
		expect(h2.textContent).toBe("Gaming Laptop 1");

		const paragraphs1 = product1Box.querySelectorAll("p");
		const paragraphs2 = product2Box.querySelectorAll("p");

		expect(paragraphs1[0].textContent).toBe(
			"Description: Powerful laptop for professional use",
		);
		expect(paragraphs1[1].textContent).toBe(
			"Tags: electronics, laptop, computer",
		);
		expect(paragraphs1[2].textContent).toBe("Stock Status: In Stock");
		expect(paragraphs1[3].textContent).toBe("Price: $1599");
		expect(paragraphs2[0].textContent).toBe(
			"Description: Versatile convertible laptop for gaming",
		);
		expect(paragraphs2[1].textContent).toBe(
			"Tags: electronics, gaming, laptop",
		);
		expect(paragraphs2[2].textContent).toBe("Stock Status: In Stock");
		expect(paragraphs2[3].textContent).toBe("Price: $1299");

		const button1 = product1Box.querySelector("button");
		const button2 = product2Box.querySelector("button");
		expect(button1.textContent).toBe("Shop Office Laptop 15");
		expect(button2.textContent).toBe("Shop Gaming Laptop 1");

		const statement = screen.getByTestId("price-diff-statement");
		expect(statement.textContent).toBe(
			"Office Laptop 15 is $300 more than Gaming Laptop 1.",
		);
	});

	it("Price difference statement is set correctly", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
				{
					_id: "67030a8520a0a48b849558d2",
					sNo: 1,
					name: "myPhone",
					price: 999,
					description: "The latest phone with advanced features",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d3",
					sNo: 2,
					name: "Galexy Fone 27",
					price: 799,
					description: "High-performance Android smartphone",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d4",
					sNo: 3,
					name: "Super 4k TV 1",
					price: 1499,
					description: "Ultra HD Smart TV with stunning visuals",
					tags: "electronics, television, tv",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d5",
					sNo: 4,
					name: "Office Laptop 15",
					price: 1599,
					description: "Powerful laptop for professional use",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d6",
					sNo: 5,
					name: "Air Sneakers 9",
					price: 129,
					description: "Stylish athletic shoes for everyday wear",
					tags: "footwear, sneakers, shoes",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d7",
					sNo: 6,
					name: "Ultra HD Camera",
					price: 3499,
					description: "High-resolution mirrorless camera",
					tags: "electronics, camera, photo",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d8",
					sNo: 7,
					name: "Super OLED TV X2",
					price: 1999,
					description:
						"Premium OLED TV with stunning picture quality",
					tags: "electronics, television, entertainment",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d9",
					sNo: 8,
					name: "Gaming Laptop 1",
					price: 1299,
					description: "Versatile convertible laptop for gaming",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
			],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ProductComparison />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
		const product1Select = screen.getByTestId("product1-select");
		const option1 = product1Select.querySelectorAll("option");
		expect(option1[1].textContent).toBe("myPhone");
		expect(option1[2].textContent).toBe("Galexy Fone 27");
		expect(option1[3].textContent).toBe("Super 4k TV 1");
		expect(option1[4].textContent).toBe("Office Laptop 15");
		expect(option1[5].textContent).toBe("Air Sneakers 9");
		expect(option1[6].textContent).toBe("Ultra HD Camera");
		expect(option1[7].textContent).toBe("Super OLED TV X2");
		expect(option1[8].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(product1Select, {
			target: { value: "67030a8520a0a48b849558d3" },
		});

		const product2Select = screen.getByTestId("product2-select");
		const option2 = product2Select.querySelectorAll("option");
		expect(option2[1].textContent).toBe("myPhone");
		expect(option2[2].textContent).toBe("Galexy Fone 27");
		expect(option2[3].textContent).toBe("Super 4k TV 1");
		expect(option2[4].textContent).toBe("Office Laptop 15");
		expect(option2[5].textContent).toBe("Air Sneakers 9");
		expect(option2[6].textContent).toBe("Ultra HD Camera");
		expect(option2[7].textContent).toBe("Super OLED TV X2");
		expect(option2[8].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(product2Select, {
			target: { value: "67030a8520a0a48b849558d2" },
		});

		const product1Box = screen.getByTestId("product1-box");
		const product2Box = screen.getByTestId("product2-box");

		const img1 = product1Box.querySelector("img");
		expect(img1).toBeInTheDocument();
		const img2 = product2Box.querySelector("img");
		expect(img2).toBeInTheDocument();

		const h1 = product1Box.querySelector("h4");
		expect(h1.textContent).toBe("Galexy Fone 27");
		const h2 = product2Box.querySelector("h4");
		expect(h2.textContent).toBe("myPhone");

		const paragraphs1 = product1Box.querySelectorAll("p");
		const paragraphs2 = product2Box.querySelectorAll("p");

		expect(paragraphs1[0].textContent).toBe(
			"Description: High-performance Android smartphone",
		);
		expect(paragraphs1[1].textContent).toBe(
			"Tags: electronics, smartphone, mobile",
		);
		expect(paragraphs1[2].textContent).toBe("Stock Status: In Stock");
		expect(paragraphs1[3].textContent).toBe("Price: $799");
		expect(paragraphs2[0].textContent).toBe(
			"Description: The latest phone with advanced features",
		);
		expect(paragraphs2[1].textContent).toBe(
			"Tags: electronics, smartphone, mobile",
		);
		expect(paragraphs2[2].textContent).toBe("Stock Status: In Stock");
		expect(paragraphs2[3].textContent).toBe("Price: $999");

		const button1 = product1Box.querySelector("button");
		const button2 = product2Box.querySelector("button");
		expect(button1.textContent).toBe("Shop Galexy Fone 27");
		expect(button2.textContent).toBe("Shop myPhone");

		const statement = screen.getByTestId("price-diff-statement");
		expect(statement.textContent).toBe(
			"Galexy Fone 27 is $200 less than myPhone.",
		);
	});

	it("Clear button functions correctly", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
				{
					_id: "67030a8520a0a48b849558d2",
					sNo: 1,
					name: "myPhone",
					price: 999,
					description: "The latest phone with advanced features",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d3",
					sNo: 2,
					name: "Galexy Fone 27",
					price: 799,
					description: "High-performance Android smartphone",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d4",
					sNo: 3,
					name: "Super 4k TV 1",
					price: 1499,
					description: "Ultra HD Smart TV with stunning visuals",
					tags: "electronics, television, tv",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d5",
					sNo: 4,
					name: "Office Laptop 15",
					price: 1599,
					description: "Powerful laptop for professional use",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d6",
					sNo: 5,
					name: "Air Sneakers 9",
					price: 129,
					description: "Stylish athletic shoes for everyday wear",
					tags: "footwear, sneakers, shoes",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d7",
					sNo: 6,
					name: "Ultra HD Camera",
					price: 3499,
					description: "High-resolution mirrorless camera",
					tags: "electronics, camera, photo",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d8",
					sNo: 7,
					name: "Super OLED TV X2",
					price: 1999,
					description:
						"Premium OLED TV with stunning picture quality",
					tags: "electronics, television, entertainment",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d9",
					sNo: 8,
					name: "Gaming Laptop 1",
					price: 1299,
					description: "Versatile convertible laptop for gaming",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
			],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ProductComparison />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
		const product1Select = screen.getByTestId("product1-select");
		fireEvent.change(product1Select, {
			target: { value: "67030a8520a0a48b849558d3" },
		});

		const product2Select = screen.getByTestId("product2-select");
		fireEvent.change(product2Select, {
			target: { value: "67030a8520a0a48b849558d2" },
		});

		let product1Box = screen.queryByTestId("product1-box");
		let product2Box = screen.queryByTestId("product2-box");
		expect(product1Box).toBeInTheDocument();
		expect(product2Box).toBeInTheDocument();

		const img1 = product1Box.querySelector("img");
		expect(img1).toBeInTheDocument();
		const img2 = product2Box.querySelector("img");
		expect(img2).toBeInTheDocument();

		const h1 = product1Box.querySelector("h4");
		expect(h1.textContent).toBe("Galexy Fone 27");
		const h2 = product2Box.querySelector("h4");
		expect(h2.textContent).toBe("myPhone");

		const paragraphs1 = product1Box.querySelectorAll("p");
		const paragraphs2 = product2Box.querySelectorAll("p");

		expect(paragraphs1[0].textContent).toBe(
			"Description: High-performance Android smartphone",
		);
		expect(paragraphs1[1].textContent).toBe(
			"Tags: electronics, smartphone, mobile",
		);
		expect(paragraphs1[2].textContent).toBe("Stock Status: In Stock");
		expect(paragraphs1[3].textContent).toBe("Price: $799");
		expect(paragraphs2[0].textContent).toBe(
			"Description: The latest phone with advanced features",
		);
		expect(paragraphs2[1].textContent).toBe(
			"Tags: electronics, smartphone, mobile",
		);
		expect(paragraphs2[2].textContent).toBe("Stock Status: In Stock");
		expect(paragraphs2[3].textContent).toBe("Price: $999");

		const button1 = product1Box.querySelector("button");
		const button2 = product2Box.querySelector("button");
		expect(button1.textContent).toBe("Shop Galexy Fone 27");
		expect(button2.textContent).toBe("Shop myPhone");

		const statement = screen.getByTestId("price-diff-statement");
		expect(statement.textContent).toBe(
			"Galexy Fone 27 is $200 less than myPhone.",
		);

		fireEvent.click(screen.getByTestId("clear-btn"));
		product1Box = screen.queryByTestId("product1-box");
		product2Box = screen.queryByTestId("product2-box");
		expect(product1Box).not.toBeInTheDocument();
		expect(product2Box).not.toBeInTheDocument();
	});

	it("Alert on selected products being very different is set correctly", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
				{
					_id: "67030a8520a0a48b849558d2",
					sNo: 1,
					name: "myPhone",
					price: 999,
					description: "The latest phone with advanced features",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d3",
					sNo: 2,
					name: "Galexy Fone 27",
					price: 799,
					description: "High-performance Android smartphone",
					tags: "electronics, smartphone, mobile",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d4",
					sNo: 3,
					name: "Super 4k TV 1",
					price: 1499,
					description: "Ultra HD Smart TV with stunning visuals",
					tags: "electronics, television, tv",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d5",
					sNo: 4,
					name: "Office Laptop 15",
					price: 1599,
					description: "Powerful laptop for professional use",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d6",
					sNo: 5,
					name: "Air Sneakers 9",
					price: 129,
					description: "Stylish athletic shoes for everyday wear",
					tags: "footwear, sneakers, shoes",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d7",
					sNo: 6,
					name: "Ultra HD Camera",
					price: 3499,
					description: "High-resolution mirrorless camera",
					tags: "electronics, camera, photo",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d8",
					sNo: 7,
					name: "Super OLED TV X2",
					price: 1999,
					description:
						"Premium OLED TV with stunning picture quality",
					tags: "electronics, television, entertainment",
					stockStatus: "In Stock",
				},
				{
					_id: "67030a8520a0a48b849558d9",
					sNo: 8,
					name: "Gaming Laptop 1",
					price: 1299,
					description: "Versatile convertible laptop for gaming",
					tags: "electronics, laptop, computer",
					stockStatus: "In Stock",
				},
			],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ProductComparison />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
		window.alert = jest.fn();
		const product1Select = screen.getByTestId("product1-select");
		fireEvent.change(product1Select, {
			target: { value: "67030a8520a0a48b849558d7" },
		});

		const product2Select = screen.getByTestId("product2-select");
		fireEvent.change(product2Select, {
			target: { value: "67030a8520a0a48b849558d8" },
		});

		let product1Box = screen.queryByTestId("product1-box");
		let product2Box = screen.queryByTestId("product2-box");
		expect(product1Box).not.toBeInTheDocument();
		expect(product2Box).not.toBeInTheDocument();

		expect(window.alert).toHaveBeenCalledWith(
			"Products are incomparable because they are very different",
		);
		window.alert.mockReset();
	});
});
