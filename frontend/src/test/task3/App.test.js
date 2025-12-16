import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import ProductDetail from "../../components/views/shop/ProductDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";
import { ShopContextProvider } from "../../../src/contexts/shopContext";
import { CurrencyProvider } from "../../../src/contexts/currencyContext";

jest.mock("../../../src/contexts/onAuth.js", () => ({
	useAuth: () => [
		{
			user: { username: "testUser", id: "testId" },
			token: "testToken",
			isLoading: false,
		},
		jest.fn(),
	],
}));

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useParams: () => ({ id: "65a4f6605cf27839a8b9b4db" }),
}));

jest.spyOn(global, "fetch").mockImplementation(async () => {
	return Promise.resolve({
		ok: true,
		json: () => Promise.resolve({ ratingValue: 3 }),
	});
});

global.console.warn = jest.fn();
global.console.error = jest.fn();

describe("Feature Testing", () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	it("Star Selection or Filling is correctly implemented ", async () => {
		const baseURL = generateBaseURL();
		fetchMock.get(`${baseURL}/api/products`, {
			status: 200,
			body: [
				{
					_id: "65a653eacb531b6ca29f8a6c",
					sNo: 1,
					name: "myPhone",
					price: 999,
					description: "The latest phone with advanced features",
					tags: "electronics, smartphone, mobile",
				},
				{
					_id: "65a4f6605cf27839a8b9b4db",
					sNo: 2,
					name: "Galexy Fone 27",
					price: 799,
					description: "High-performance Android smartphone",
					tags: "electronics, smartphone, mobile",
				},
			],
		});
		fetchMock.get(
			`${baseURL}/api/products/detail/65a4f6605cf27839a8b9b4db`,
			{
				status: 200,
				body: {
					_id: "65a4f6605cf27839a8b9b4db",
					sNo: 2,
					name: "Galexy Fone 27",
					price: 799,
					description: "High-performance Android smartphone",
					tags: "electronics, smartphone, mobile",
				},
			},
		);

		await act(async () => {
			render(
				<Router>
					<ShopContextProvider>
						<CurrencyProvider>
							<Routes>
								<Route path="/" element={<ProductDetail />} />
							</Routes>
						</CurrencyProvider>
					</ShopContextProvider>
				</Router>,
			);
		});

		const RatingContainer = screen.getByTestId("star-rating-container");
		let stars = RatingContainer.getElementsByTagName("img");
		fireEvent.click(stars[2]);
		for (let i = 0; i < 5; i++) {
			if (i < 3) {
				expect(stars[i].getAttribute("src")).toBe("filled.svg");
			} else {
				expect(stars[i].getAttribute("src")).toBe("empty.svg");
			}
		}
		await act(async () => {
			fireEvent.click(stars[0]);
		});
		for (let i = 0; i < 5; i++) {
			if (i < 3) {
				expect(stars[i].getAttribute("src")).toBe("filled.svg");
			} else {
				expect(stars[i].getAttribute("src")).toBe("empty.svg");
			}
		}
	});
});
