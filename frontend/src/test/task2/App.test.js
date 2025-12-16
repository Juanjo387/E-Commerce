import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import Orders from "../../components/layout/User/Orders";
import Payment from "../../components/views/payment/Payment";
import { MemoryRouter } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";
import { ShopContextProvider } from "../../../src/contexts/shopContext";
import { CurrencyProvider } from "../../../src/contexts/currencyContext";

global.fetch = jest.fn(() =>
	Promise.resolve({
		/* eslint-disable-next-line no-undef */
		json: () => Promise.resolve(data),
	}),
);

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

	it("Shipping details are not missing from placed order", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/orders/testUser`, {
			status: 200,
			body: [
				{
					_id: "1",
					username: "testUser",
					totalAmount: 50,
					products: [
						{ name: "Product 1", price: 20 },
						{ name: "Product 2", price: 30 },
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
		expect(screen.getByTestId("total-amount").textContent).toBe(
			"Total Amount $ 50",
		);

		expect(screen.getAllByTestId("products-name")[0].textContent).toBe(
			"Product 1",
		);
		expect(screen.getAllByTestId("products-price")[0].textContent).toBe(
			"Price: 20",
		);
		expect(screen.getAllByTestId("products-name")[1].textContent).toBe(
			"Product 2",
		);
		expect(screen.getAllByTestId("products-price")[1].textContent).toBe(
			"Price: 30",
		);

		expect(screen.getByTestId("street").textContent).toBe(
			"Street: 123 Main Street",
		);
		expect(screen.getByTestId("city").textContent).toBe("City: Bangalore");
		expect(screen.getByTestId("state").textContent).toBe(
			"State: Karnataka",
		);
		expect(screen.getByTestId("zipCode").textContent).toBe("ZIP Code: 123456");
	});

	it("Address state retrieval is correctly done", async () => {
		const baseURL = generateBaseURL();
		fetchMock.postOnce(`${baseURL}/api/orders`, {
			success: true,
		});
		const address = {
			street: "123 Main Street",
			city: "Bangalore",
			state: "Karnataka",
			zipCode: "123456",
		};

		jest.spyOn(require("react-router-dom"), "useLocation").mockReturnValue({
			state: { address: address },
		});
		render(
			<ShopContextProvider>
				<MemoryRouter>
					<Payment />
				</MemoryRouter>
			</ShopContextProvider>,
		);

		const cardNumber = await screen.findByTestId("cardNumber");
		const cvv = await screen.findByTestId("cvv");
		const expiry = await screen.findByTestId("expiryDate");
		const paymentButton = await screen.findByTestId("paymentButton");

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
			`${baseURL}/api/orders`,
			"POST",
		);
		const requestBody = JSON.parse(options.body);
		expect(requestBody.address).toEqual(address);
	});
});
