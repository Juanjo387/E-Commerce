import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import ExchangeProduct from "../../components/layout/User/ExchangeProduct";
import Payment from "../../components/views/payment/Payment";
import Orders from "../../components/layout/User/Orders";
import { MemoryRouter } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";
import { ShopContextProvider } from "../../../src/contexts/shopContext";
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

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: jest.fn(),
}));

global.console.warn = jest.fn();
global.console.error = jest.fn();

describe("BugFix Testing", () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	it("One purchased product and all available products have been correctly fetched.", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
				{
					_id: "1",
					username: "testUser",
					totalAmount: 799,
					products: [
						{
                            "id": "66fe8a6458d2fd271dcf28ee",
                            "sNo": 2,
                            "name": "Galexy Fone 27",
                            "price": 799
                        },
					],
					address: {
						street: "123 Main Street",
						city: "Bangalore",
						state: "Karnataka",
						zipCode: "123456",
					},
					payment: {
						cardNumber: "1234567812345678",
						expiryDate: "09/25",
						cvv: 123,
					},
				},
			],
		});

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
                {
                  "_id": "66fe8a6458d2fd271dcf28ed",
                  "sNo": 1,
                  "name": "myPhone",
                  "price": 999,
                  "description": "The latest phone with advanced features",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ee",
                  "sNo": 2,
                  "name": "Galexy Fone 27",
                  "price": 799,
                  "description": "High-performance Android smartphone",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ef",
                  "sNo": 3,
                  "name": "Super 4k TV 1",
                  "price": 1499,
                  "description": "Ultra HD Smart TV with stunning visuals",
                  "tags": "electronics, television, tv",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28f0",
                  "sNo": 4,
                  "name": "Office Laptop 15",
                  "price": 1599,
                  "description": "Powerful laptop for professional use",
                  "tags": "electronics, laptop, computer",
                  "stockStatus": "In Stock"
                },
            ]
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ExchangeProduct />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
        const purchasedSelect = screen.getByTestId("purchased-product-select");
        const option1 = purchasedSelect.querySelectorAll("option");
        expect(option1[1].textContent).toBe("Galexy Fone 27");

		fireEvent.change(purchasedSelect, { target: { value: "66fe8a6458d2fd271dcf28ee" } });
        
        const availableSelect = screen.getByTestId("available-product-select");
        const option2 = availableSelect.querySelectorAll("option"); 
        expect(option2[1].textContent).toBe("myPhone");
        expect(option2[2].textContent).toBe("Galexy Fone 27");
        expect(option2[3].textContent).toBe("Super 4k TV 1");
        expect(option2[4].textContent).toBe("Office Laptop 15");

        fireEvent.change(availableSelect, { target: { value: "66fe8a6458d2fd271dcf28ed" } });
		
        const purchasedProductBox = screen.getByTestId("purchased-product-box");
        const availableProductBox = screen.getByTestId("available-product-box");

        const img1 = purchasedProductBox.querySelector("img");
        expect(img1).toBeInTheDocument();
        const img2 = availableProductBox.querySelector("img");
        expect(img2).toBeInTheDocument();

        const paragraphs1 = purchasedProductBox.querySelectorAll("p");
        const paragraphs2 = availableProductBox.querySelectorAll("p");

        expect(paragraphs1[0].textContent).toBe("Name: Galexy Fone 27");
        expect(paragraphs1[1].textContent).toBe("Description: High-performance Android smartphone");
        expect(paragraphs1[2].textContent).toBe("Tags: electronics, smartphone, mobile");
        expect(paragraphs1[3].textContent).toBe("Price: $799");
        expect(paragraphs2[0].textContent).toBe("Name: myPhone");
        expect(paragraphs2[1].textContent).toBe("Description: The latest phone with advanced features");
        expect(paragraphs2[2].textContent).toBe("Tags: electronics, smartphone, mobile");
        expect(paragraphs2[3].textContent).toBe("Price: $999");
	});

	it("Multiple purchased products and all available products have been correctly fetched.", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
                {
                  _id: "1",
                  username: "testUser",
                  totalAmount: 1499,
                  products: [
                    {
                       "id": "66fe8a6458d2fd271dcf28ef",
                       "sNo": 3,
                       "name": "Super 4k TV 1",
                       "price": 1499,
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "09/26",
                    cvv: 123
                  }
                },
                {
                  _id: "2",
                  username: "testUser",
                  totalAmount: 1428,
                  products: [
                    {
                      "id": "66fe9c361daa3861adbbea20",
                      "sNo": 5,
                      "name": "Air Sneakers 9",
                      "price": 129
                    },
                    {
                      "id": "66fe9c361daa3861adbbea23",
                      "sNo": 8,
                      "name": "Gaming Laptop 1",
                      "price": 1299
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "05/25",
                    cvv: 123
                  },
                }
            ]
		});

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
                {
                  "_id": "66fe8a6458d2fd271dcf28ed",
                  "sNo": 1,
                  "name": "myPhone",
                  "price": 999,
                  "description": "The latest phone with advanced features",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ee",
                  "sNo": 2,
                  "name": "Galexy Fone 27",
                  "price": 799,
                  "description": "High-performance Android smartphone",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ef",
                  "sNo": 3,
                  "name": "Super 4k TV 1",
                  "price": 1499,
                  "description": "Ultra HD Smart TV with stunning visuals",
                  "tags": "electronics, television, tv",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28f0",
                  "sNo": 4,
                  "name": "Office Laptop 15",
                  "price": 1599,
                  "description": "Powerful laptop for professional use",
                  "tags": "electronics, laptop, computer",
                  "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea20",
                    "sNo": 5,
                    "name": "Air Sneakers 9",
                    "price": 129,
                    "description": "Stylish athletic shoes for everyday wear",
                    "tags": "footwear, sneakers, shoes",
                    "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea23",
                    "sNo": 8,
                    "name": "Gaming Laptop 1",
                    "price": 1299,
                    "description": "Versatile convertible laptop for gaming",
                    "tags": "electronics, laptop, computer",
                    "stockStatus": "In Stock"
                },
            ]
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ExchangeProduct />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
        const purchasedSelect = screen.getByTestId("purchased-product-select");
        const option1 = purchasedSelect.querySelectorAll("option");
        expect(option1[1].textContent).toBe("Super 4k TV 1");
        expect(option1[2].textContent).toBe("Air Sneakers 9");
        expect(option1[3].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(purchasedSelect, { target: { value: "66fe9c361daa3861adbbea20" } });
        
        const availableSelect = screen.getByTestId("available-product-select");
        const option2 = availableSelect.querySelectorAll("option"); 
        expect(option2[1].textContent).toBe("myPhone");
        expect(option2[2].textContent).toBe("Galexy Fone 27");
        expect(option2[3].textContent).toBe("Super 4k TV 1");
        expect(option2[4].textContent).toBe("Office Laptop 15");
        expect(option2[5].textContent).toBe("Air Sneakers 9");
        expect(option2[6].textContent).toBe("Gaming Laptop 1");

        fireEvent.change(availableSelect, { target: { value: "66fe8a6458d2fd271dcf28ef" } });
		
        const purchasedProductBox = screen.getByTestId("purchased-product-box");
        const availableProductBox = screen.getByTestId("available-product-box");

        const img1 = purchasedProductBox.querySelector("img");
        expect(img1).toBeInTheDocument();
        const img2 = availableProductBox.querySelector("img");
        expect(img2).toBeInTheDocument();

        const paragraphs1 = purchasedProductBox.querySelectorAll("p");
        const paragraphs2 = availableProductBox.querySelectorAll("p");

        expect(paragraphs1[0].textContent).toBe("Name: Air Sneakers 9");
        expect(paragraphs1[1].textContent).toBe("Description: Stylish athletic shoes for everyday wear");
        expect(paragraphs1[2].textContent).toBe("Tags: footwear, sneakers, shoes");
        expect(paragraphs1[3].textContent).toBe("Price: $129");
        expect(paragraphs2[0].textContent).toBe("Name: Super 4k TV 1");
        expect(paragraphs2[1].textContent).toBe("Description: Ultra HD Smart TV with stunning visuals");
        expect(paragraphs2[2].textContent).toBe("Tags: electronics, television, tv");
        expect(paragraphs2[3].textContent).toBe("Price: $1499");
	});

	it("Select both products condition is correctly handled", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
                {
                  _id: "1",
                  username: "testUser",
                  totalAmount: 1499,
                  products: [
                    {
                       "id": "66fe8a6458d2fd271dcf28ef",
                       "sNo": 3,
                       "name": "Super 4k TV 1",
                       "price": 1499,
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "09/26",
                    cvv: 123
                  }
                },
                {
                  _id: "2",
                  username: "testUser",
                  totalAmount: 1428,
                  products: [
                    {
                      "id": "66fe9c361daa3861adbbea20",
                      "sNo": 5,
                      "name": "Air Sneakers 9",
                      "price": 129
                    },
                    {
                      "id": "66fe9c361daa3861adbbea23",
                      "sNo": 8,
                      "name": "Gaming Laptop 1",
                      "price": 1299
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "05/25",
                    cvv: 123
                  },
                }
            ]
		});

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
                {
                  "_id": "66fe8a6458d2fd271dcf28ed",
                  "sNo": 1,
                  "name": "myPhone",
                  "price": 999,
                  "description": "The latest phone with advanced features",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ee",
                  "sNo": 2,
                  "name": "Galexy Fone 27",
                  "price": 799,
                  "description": "High-performance Android smartphone",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ef",
                  "sNo": 3,
                  "name": "Super 4k TV 1",
                  "price": 1499,
                  "description": "Ultra HD Smart TV with stunning visuals",
                  "tags": "electronics, television, tv",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28f0",
                  "sNo": 4,
                  "name": "Office Laptop 15",
                  "price": 1599,
                  "description": "Powerful laptop for professional use",
                  "tags": "electronics, laptop, computer",
                  "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea20",
                    "sNo": 5,
                    "name": "Air Sneakers 9",
                    "price": 129,
                    "description": "Stylish athletic shoes for everyday wear",
                    "tags": "footwear, sneakers, shoes",
                    "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea23",
                    "sNo": 8,
                    "name": "Gaming Laptop 1",
                    "price": 1299,
                    "description": "Versatile convertible laptop for gaming",
                    "tags": "electronics, laptop, computer",
                    "stockStatus": "In Stock"
                },
            ]
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ExchangeProduct />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
        let purchasedSelect = screen.getByTestId("purchased-product-select");
        const option1 = purchasedSelect.querySelectorAll("option");
        expect(option1[1].textContent).toBe("Super 4k TV 1");
        expect(option1[2].textContent).toBe("Air Sneakers 9");
        expect(option1[3].textContent).toBe("Gaming Laptop 1");
        
        let availableSelect = screen.getByTestId("available-product-select");
        const option2 = availableSelect.querySelectorAll("option"); 
        expect(option2[1].textContent).toBe("myPhone");
        expect(option2[2].textContent).toBe("Galexy Fone 27");
        expect(option2[3].textContent).toBe("Super 4k TV 1");
        expect(option2[4].textContent).toBe("Office Laptop 15");
        expect(option2[5].textContent).toBe("Air Sneakers 9");
        expect(option2[6].textContent).toBe("Gaming Laptop 1");

        fireEvent.change(availableSelect, { target: { value: "66fe8a6458d2fd271dcf28f0" } });
		
        let purchasedProductBox = screen.queryByTestId("purchased-product-box");
        let availableProductBox = screen.getByTestId("available-product-box");

        let img = availableProductBox.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(purchasedProductBox).not.toBeInTheDocument();

        let paragraphs = availableProductBox.querySelectorAll("p");
        expect(paragraphs[0].textContent).toBe("Name: Office Laptop 15");
        expect(paragraphs[1].textContent).toBe("Description: Powerful laptop for professional use");
        expect(paragraphs[2].textContent).toBe("Tags: electronics, laptop, computer");
        expect(paragraphs[3].textContent).toBe("Price: $1599");
        
        window.alert = jest.fn();
        fireEvent.click(screen.getByTestId("exchange-btn"));
        expect(window.alert).toHaveBeenCalledWith("Please select both products to exchange");
        window.alert.mockReset();

        purchasedSelect = screen.getByTestId("purchased-product-select");
        availableSelect = screen.getByTestId("available-product-select");

        fireEvent.change(purchasedSelect, { target: { value: "66fe9c361daa3861adbbea23" } });
        fireEvent.change(availableSelect, { target: { value: "" } });

        purchasedProductBox = screen.getByTestId("purchased-product-box");
        availableProductBox = screen.queryByTestId("available-product-box");

        img = purchasedProductBox.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(availableProductBox).not.toBeInTheDocument();

        paragraphs = purchasedProductBox.querySelectorAll("p");
        expect(paragraphs[0].textContent).toBe("Name: Gaming Laptop 1");
        expect(paragraphs[1].textContent).toBe("Description: Versatile convertible laptop for gaming");
        expect(paragraphs[2].textContent).toBe("Tags: electronics, laptop, computer");
        expect(paragraphs[3].textContent).toBe("Price: $1299");

        window.alert = jest.fn();
        fireEvent.click(screen.getByTestId("exchange-btn"));
        expect(window.alert).toHaveBeenCalledWith("Please select both products to exchange");
        window.alert.mockReset();
	});

	it("Exchange is allowed only for products with a higher price condition is correctly handled", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
                {
                  _id: "1",
                  username: "testUser",
                  totalAmount: 1499,
                  products: [
                    {
                       "id": "66fe8a6458d2fd271dcf28ef",
                       "sNo": 3,
                       "name": "Super 4k TV 1",
                       "price": 1499,
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "09/26",
                    cvv: 123
                  }
                },
                {
                  _id: "2",
                  username: "testUser",
                  totalAmount: 1428,
                  products: [
                    {
                      "id": "66fe9c361daa3861adbbea20",
                      "sNo": 5,
                      "name": "Air Sneakers 9",
                      "price": 129
                    },
                    {
                      "id": "66fe9c361daa3861adbbea23",
                      "sNo": 8,
                      "name": "Gaming Laptop 1",
                      "price": 1299
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "05/25",
                    cvv: 123
                  },
                }
            ]
		});

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
                {
                  "_id": "66fe8a6458d2fd271dcf28ed",
                  "sNo": 1,
                  "name": "myPhone",
                  "price": 999,
                  "description": "The latest phone with advanced features",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ee",
                  "sNo": 2,
                  "name": "Galexy Fone 27",
                  "price": 799,
                  "description": "High-performance Android smartphone",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ef",
                  "sNo": 3,
                  "name": "Super 4k TV 1",
                  "price": 1499,
                  "description": "Ultra HD Smart TV with stunning visuals",
                  "tags": "electronics, television, tv",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28f0",
                  "sNo": 4,
                  "name": "Office Laptop 15",
                  "price": 1599,
                  "description": "Powerful laptop for professional use",
                  "tags": "electronics, laptop, computer",
                  "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea20",
                    "sNo": 5,
                    "name": "Air Sneakers 9",
                    "price": 129,
                    "description": "Stylish athletic shoes for everyday wear",
                    "tags": "footwear, sneakers, shoes",
                    "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea23",
                    "sNo": 8,
                    "name": "Gaming Laptop 1",
                    "price": 1299,
                    "description": "Versatile convertible laptop for gaming",
                    "tags": "electronics, laptop, computer",
                    "stockStatus": "In Stock"
                },
            ]
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ExchangeProduct />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
        const purchasedSelect = screen.getByTestId("purchased-product-select");
        const option1 = purchasedSelect.querySelectorAll("option");
        expect(option1[1].textContent).toBe("Super 4k TV 1");
        expect(option1[2].textContent).toBe("Air Sneakers 9");
        expect(option1[3].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(purchasedSelect, { target: { value: "66fe9c361daa3861adbbea23" } });
        
        const availableSelect = screen.getByTestId("available-product-select");
        const option2 = availableSelect.querySelectorAll("option"); 
        expect(option2[1].textContent).toBe("myPhone");
        expect(option2[2].textContent).toBe("Galexy Fone 27");
        expect(option2[3].textContent).toBe("Super 4k TV 1");
        expect(option2[4].textContent).toBe("Office Laptop 15");
        expect(option2[5].textContent).toBe("Air Sneakers 9");
        expect(option2[6].textContent).toBe("Gaming Laptop 1");

        fireEvent.change(availableSelect, { target: { value: "66fe9c361daa3861adbbea20" } });
		
        const purchasedProductBox = screen.getByTestId("purchased-product-box");
        const availableProductBox = screen.getByTestId("available-product-box");

        const img1 = purchasedProductBox.querySelector("img");
        expect(img1).toBeInTheDocument();
        const img2 = availableProductBox.querySelector("img");
        expect(img2).toBeInTheDocument();

        const paragraphs1 = purchasedProductBox.querySelectorAll("p");
        const paragraphs2 = availableProductBox.querySelectorAll("p");

        expect(paragraphs1[0].textContent).toBe("Name: Gaming Laptop 1");
        expect(paragraphs1[1].textContent).toBe("Description: Versatile convertible laptop for gaming");
        expect(paragraphs1[2].textContent).toBe("Tags: electronics, laptop, computer");
        expect(paragraphs1[3].textContent).toBe("Price: $1299");
        expect(paragraphs2[0].textContent).toBe("Name: Air Sneakers 9");
        expect(paragraphs2[1].textContent).toBe("Description: Stylish athletic shoes for everyday wear");
        expect(paragraphs2[2].textContent).toBe("Tags: footwear, sneakers, shoes");
        expect(paragraphs2[3].textContent).toBe("Price: $129");
        
        window.alert = jest.fn();
        fireEvent.click(screen.getByTestId("exchange-btn"));
        expect(window.alert).toHaveBeenCalledWith("Exchange is allowed only for products with a higher price");
        window.alert.mockReset();
	});

	it("State management between component and payment is correctly handled", async () => {
		const baseURL = generateBaseURL();
		fetchMock.postOnce(`${baseURL}/api/orders/exchange`, {
			success: true,
		});
		const selectedNewProduct = {
			description: "High-performance Android smartphone",
            name: "Galexy Fone 27",
            price: 799,
            sNo: 2,
            stockStatus: "In Stock",
            tags: "electronics, smartphone, mobile",
            _id: "66fe8a6458d2fd271dcf28ee"
		};

		const selectedPurchasedProduct = {
			description: "Stylish athletic shoes for everyday wear",
            name: "Air Sneakers 9",
            price: 129,
            sNo: 5,
            stockStatus: "In Stock",
            tags: "footwear, sneakers, shoes",
            id: "66fe9c361daa3861adbbea20"
		};


		jest.spyOn(require("react-router-dom"), "useLocation").mockReturnValue({
			state: {
				exchange: true,
				priceDifference: 670,
				selectedPurchasedProduct: selectedPurchasedProduct,
				selectedNewProduct: selectedNewProduct,
			},
		});
		render(
			<CurrencyProvider>
                <ShopContextProvider>
				    <MemoryRouter>
					    <Payment />
				    </MemoryRouter>
                </ShopContextProvider>
            </CurrencyProvider>,
		);

		const cardNumber = await screen.findByTestId("cardNumber");
		const cvv = await screen.findByTestId("cvv");
		const expiry = await screen.findByTestId("expiryDate");
		const paymentButton = await screen.findByTestId("paymentButton");
        const payment = { 
            cardNumber: '1234567812345678', 
            expiryDate: '12/25', 
            cvv: '123' 
        };

		fireEvent.change(cardNumber, {
			target: { value: "1234567812345678" },
		});
		fireEvent.change(expiry, {
			target: { value: "12/25" },
		});
		fireEvent.change(cvv, { target: { value: "123" } });

		await act(async () => {
			fireEvent.click(paymentButton);
		});

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2100));
		});
		/* eslint-disable-next-line no-unused-vars */
		const [url, options] = fetchMock.lastCall(
			`${baseURL}/api/orders/exchange`,
			"POST",
		);
		const requestBody = JSON.parse(options.body);
		expect(requestBody.priceDifference).toEqual(670);
		expect(requestBody.payment).toEqual(payment);
		expect(requestBody.oldProductId).toEqual("66fe9c361daa3861adbbea20");
		expect(requestBody.newProductId).toEqual("66fe8a6458d2fd271dcf28ee");
	});

    it("Order dashboard represents the exchanged product correctly", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
                {
                  _id: "1",
                  username: "testUser",
                  totalAmount: 129,
                  products: [
                    {
                        "id": "66fe9c361daa3861adbbea20",
                        "sNo": 5,
                        "name": "Air Sneakers 9",
                        "price": 129
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "09/26",
                    cvv: 123
                  }
                },
                {
                  _id: "2",
                  username: "testUser",
                  totalAmount: 2798,
                  products: [
                    {
                        "_id": "66fe8a6458d2fd271dcf28ef",
                        "sNo": 3,
                        "name": "Super 4k TV 1",
                        "price": 1499,
                        "description": "Ultra HD Smart TV with stunning visuals",
                        "tags": "electronics, television, tv",
                        "stockStatus": "In Stock",
                        "isExchanged": true,
                        "extraPaid": 500
                    },
                    {
                      "id": "66fe9c361daa3861adbbea23",
                      "sNo": 8,
                      "name": "Gaming Laptop 1",
                      "price": 1299
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "05/25",
                    cvv: 123
                  },
                }
            ]
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<Orders />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
        expect(screen.getByText("All Orders")).toBeInTheDocument();
		expect(screen.getAllByTestId("total-amount")[0].textContent).toBe(
			"Total Amount $ 129",
		);
		expect(screen.getAllByTestId("total-amount")[1].textContent).toBe(
			"Total Amount $ 2798",
		);

		expect(screen.getAllByTestId("products-name")[0].textContent).toBe(
			"Air Sneakers 9",
		);
        expect(screen.getAllByTestId("products-name")[1].textContent).toBe(
			"Super 4k TV 1",
		);
        expect(screen.getAllByTestId("products-name")[2].textContent).toBe(
			"Gaming Laptop 1",
		);

		expect(screen.getAllByTestId("products-price")[0].textContent).toBe(
			"Price: 129",
		);
		expect(screen.getAllByTestId("products-price")[1].textContent).toBe(
			"Price: 1499",
		);
		expect(screen.getAllByTestId("products-price")[2].textContent).toBe(
			"Price: 1299",
		);

        const exchangedProductDetails = screen.getAllByTestId("products-detail");
        expect(exchangedProductDetails[0].textContent).not.toContain("Involved in an exchange");
        expect(exchangedProductDetails[1].textContent).toContain("Involved in an exchange, paid $500 extra");

        const exchangeTextCount = exchangedProductDetails.filter(detail =>
            detail.textContent.includes("Involved in an exchange")
        ).length;

        expect(exchangeTextCount).toBe(1);
	});

    it("Exchanged products are not eligible for re-exchange condition is correctly handled", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
                {
                  _id: "1",
                  username: "testUser",
                  totalAmount: 129,
                  products: [
                    {
                        "id": "66fe9c361daa3861adbbea20",
                        "sNo": 5,
                        "name": "Air Sneakers 9",
                        "price": 129
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "09/26",
                    cvv: 123
                  }
                },
                {
                  _id: "2",
                  username: "testUser",
                  totalAmount: 2798,
                  products: [
                    {
                        "_id": "66fe8a6458d2fd271dcf28ef",
                        "sNo": 3,
                        "name": "Super 4k TV 1",
                        "price": 1499,
                        "description": "Ultra HD Smart TV with stunning visuals",
                        "tags": "electronics, television, tv",
                        "stockStatus": "In Stock",
                        "isExchanged": true,
                        "extraPaid": 500
                    },
                    {
                      "id": "66fe9c361daa3861adbbea23",
                      "sNo": 8,
                      "name": "Gaming Laptop 1",
                      "price": 1299
                    }
                  ],
                  address: {
                    street: "123 Main Street",
                    city: "Bangalore",
                    state: "Karnataka",
                    zipCode: "123456",
                  },
                  payment: {
                    cardNumber: "1234567887654321",
                    expiryDate: "05/25",
                    cvv: 123
                  },
                }
            ]
		});

		fetchMock.getOnce(`${baseURL}/api/products`, {
			status: 200,
			body: [
                {
                  "_id": "66fe8a6458d2fd271dcf28ed",
                  "sNo": 1,
                  "name": "myPhone",
                  "price": 999,
                  "description": "The latest phone with advanced features",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ee",
                  "sNo": 2,
                  "name": "Galexy Fone 27",
                  "price": 799,
                  "description": "High-performance Android smartphone",
                  "tags": "electronics, smartphone, mobile",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28ef",
                  "sNo": 3,
                  "name": "Super 4k TV 1",
                  "price": 1499,
                  "description": "Ultra HD Smart TV with stunning visuals",
                  "tags": "electronics, television, tv",
                  "stockStatus": "In Stock"
                },
                {
                  "_id": "66fe8a6458d2fd271dcf28f0",
                  "sNo": 4,
                  "name": "Office Laptop 15",
                  "price": 1599,
                  "description": "Powerful laptop for professional use",
                  "tags": "electronics, laptop, computer",
                  "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea20",
                    "sNo": 5,
                    "name": "Air Sneakers 9",
                    "price": 129,
                    "description": "Stylish athletic shoes for everyday wear",
                    "tags": "footwear, sneakers, shoes",
                    "stockStatus": "In Stock"
                },
                {
                    "_id": "66fe9c361daa3861adbbea23",
                    "sNo": 8,
                    "name": "Gaming Laptop 1",
                    "price": 1299,
                    "description": "Versatile convertible laptop for gaming",
                    "tags": "electronics, laptop, computer",
                    "stockStatus": "In Stock"
                },
            ]
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<ExchangeProduct />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});
        const purchasedSelect = screen.getByTestId("purchased-product-select");
        const option1 = purchasedSelect.querySelectorAll("option");
        expect(option1[1].textContent).toBe("Air Sneakers 9");
        expect(option1[2].textContent).toBe("Super 4k TV 1");
        expect(option1[3].textContent).toBe("Gaming Laptop 1");

		fireEvent.change(purchasedSelect, { target: { value: "66fe8a6458d2fd271dcf28ef" } });
        
        const availableSelect = screen.getByTestId("available-product-select");
        const option2 = availableSelect.querySelectorAll("option"); 
        expect(option2[1].textContent).toBe("myPhone");
        expect(option2[2].textContent).toBe("Galexy Fone 27");
        expect(option2[3].textContent).toBe("Super 4k TV 1");
        expect(option2[4].textContent).toBe("Office Laptop 15");
        expect(option2[5].textContent).toBe("Air Sneakers 9");
        expect(option2[6].textContent).toBe("Gaming Laptop 1");

        fireEvent.change(availableSelect, { target: { value: "66fe8a6458d2fd271dcf28f0" } });
		
        const purchasedProductBox = screen.getByTestId("purchased-product-box");
        const availableProductBox = screen.getByTestId("available-product-box");

        const img1 = purchasedProductBox.querySelector("img");
        expect(img1).toBeInTheDocument();
        const img2 = availableProductBox.querySelector("img");
        expect(img2).toBeInTheDocument();

        const paragraphs1 = purchasedProductBox.querySelectorAll("p");
        const paragraphs2 = availableProductBox.querySelectorAll("p");

        expect(paragraphs1[0].textContent).toBe("Name: Super 4k TV 1");
        expect(paragraphs1[1].textContent).toBe("Description: Ultra HD Smart TV with stunning visuals");
        expect(paragraphs1[2].textContent).toBe("Tags: electronics, television, tv");
        expect(paragraphs1[3].textContent).toBe("Price: $1499");
        expect(paragraphs2[0].textContent).toBe("Name: Office Laptop 15");
        expect(paragraphs2[1].textContent).toBe("Description: Powerful laptop for professional use");
        expect(paragraphs2[2].textContent).toBe("Tags: electronics, laptop, computer");
        expect(paragraphs2[3].textContent).toBe("Price: $1599");
        
        window.alert = jest.fn();
        fireEvent.click(screen.getByTestId("exchange-btn"));
        expect(window.alert).toHaveBeenCalledWith("Exchanged products are not eligible for re-exchange");
        window.alert.mockReset();
	});
});
