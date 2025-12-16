import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import OrderList from "../../components/layout/Admin/OrderList";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";
import { CurrencyProvider } from "../../../src/contexts/currencyContext";
import AdminMenu from "../../components/layout/Admin/AdminMenu";

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

describe("BugFix Testing", () => {
	beforeEach(() => {
		fetchMock.reset();
		jest.clearAllMocks();
	});

	it("Renders the OrderList component on clicking Orders NavLink", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/orders`, {
			status: 200,
			body: [],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter initialEntries={["/dashboard/admin"]}>
						<Routes>
							<Route
								path="/dashboard/admin"
								element={<AdminMenu />}
							/>
							<Route
								path="/dashboard/admin/orders"
								element={<OrderList />}
							/>
						</Routes>
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});

		await act(async () => {
			fireEvent.click(screen.getByTestId("orders"));
		});

		expect(screen.queryByTestId("order-list")).toBeInTheDocument();
	});

	it("OrderList details are correctly fetched & displayed for a single order", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/orders`, {
			status: 200,
			body: [
				{
					_id: "6799d9bdf08b571b7c11b8f5",
					username: "testuser",
					totalAmount: 1798,
					products: [
						{
							id: "67978f129af6c9db83be6c1c",
							sNo: 1,
							name: "myPhone",
							price: 999,
						},
						{
							id: "67978f129af6c9db83be6c1d",
							sNo: 2,
							name: "Galexy Fone 27",
							price: 799,
						},
					],
					address: "",
					payment: {},
					variant: null,
				},
			],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<OrderList />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});

		expect(screen.getByTestId("order-id").textContent).toBe(
			"Order ID: 6799d9bdf08b571b7c11b8f5",
		);
		expect(screen.getByTestId("customer-name").textContent).toBe(
			"Customer Name: testuser",
		);
		expect(screen.getByTestId("amount").textContent).toBe(
			"Total Amount: $1798",
		);
		expect(screen.getByTestId("all-orders-amount").textContent).toBe(
			"Total Amount of All Orders: $1798",
		);
	});

	it("OrderList details are correctly fetched & displayed for multiple orders", async () => {
		const baseURL = generateBaseURL();

		fetchMock.getOnce(`${baseURL}/api/orders`, {
			status: 200,
			body: [
				{
					_id: "6799d9bdf08b571b7c11b8f5",
					username: "testuser",
					totalAmount: 1798,
					products: [
						{
							id: "67978f129af6c9db83be6c1c",
							sNo: 1,
							name: "myPhone",
							price: 999,
						},
						{
							id: "67978f129af6c9db83be6c1d",
							sNo: 2,
							name: "Galexy Fone 27",
							price: 799,
						},
					],
					address: "",
					payment: {},
					variant: null,
				},
				{
					_id: "6799d9bdf08b571b7c11b8f6",
					username: "testuser2",
					totalAmount: 1499,
					products: [
						{
							id: "67978f129af6c9db83be6c1e",
							sNo: 3,
							name: "Super 4k TV 1",
							price: 1499,
						},
					],
					address: "",
					payment: {},
					variant: null,
				},
			],
		});

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<OrderList />
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});

		expect(screen.getAllByTestId("order-id")[0].textContent).toBe(
			"Order ID: 6799d9bdf08b571b7c11b8f5",
		);
		expect(screen.getAllByTestId("customer-name")[0].textContent).toBe(
			"Customer Name: testuser",
		);
		expect(screen.getAllByTestId("amount")[0].textContent).toBe(
			"Total Amount: $1798",
		);

		expect(screen.getAllByTestId("order-id")[1].textContent).toBe(
			"Order ID: 6799d9bdf08b571b7c11b8f6",
		);
		expect(screen.getAllByTestId("customer-name")[1].textContent).toBe(
			"Customer Name: testuser2",
		);
		expect(screen.getAllByTestId("amount")[1].textContent).toBe(
			"Total Amount: $1499",
		);

		expect(screen.getByTestId("all-orders-amount").textContent).toBe(
			"Total Amount of All Orders: $3297",
		);
	});
});
