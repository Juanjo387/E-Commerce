import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import { Shop } from "../../components/views/shop/Shop";
import Navbar from "../../components/Navbar/Navbar";
import { generateBaseURL } from "../../../../frontend/src/utils";
import { MemoryRouter } from "react-router-dom";
import { CurrencyProvider } from "../../../src/contexts/currencyContext";

jest.mock("../../../src/contexts/onAuth.js", () => ({
	useAuth: () => [
		{
			user: { username: "testUser", id: "testId", role: "admin" },
			token: "testToken",
			isLoading: false,
		},
		jest.fn(),
	],
}));

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

global.console.warn = jest.fn();
global.console.error = jest.fn();

describe("Bugfix Testing", () => {
	let setIsSaleActiveMock;

	beforeEach(() => {
		fetchMock.reset();
		setIsSaleActiveMock = jest.fn();
	});

	it("should toggle sale state when start and end sale buttons are clicked", async () => {
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

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<Navbar setIsSaleActive={setIsSaleActiveMock}/>
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});

        expect(screen.queryByTestId("start-sale-btn")).not.toBeInTheDocument();
        expect(screen.queryByTestId("end-sale-btn")).not.toBeInTheDocument();
		
        fireEvent.click(screen.getByTestId("sale-btn"));
        expect(screen.queryByTestId("start-sale-btn")).toBeInTheDocument();
        expect(screen.queryByTestId("end-sale-btn")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("start-sale-btn"));
		expect(setIsSaleActiveMock).toHaveBeenCalledWith(true);

		fireEvent.click(screen.getByTestId("end-sale-btn"));
		expect(setIsSaleActiveMock).toHaveBeenCalledWith(false);
	});

	it("should display correct sale banner and update prices and tags when the sale is active", async () => {
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

		await act(async () => {
			render(
				<CurrencyProvider>
					<MemoryRouter>
						<Shop isSaleActive={true}/>
					</MemoryRouter>
				</CurrencyProvider>,
			);
		});

        let SaleBanner = screen.getByTestId("sale-banner");
        let Price = screen.getAllByTestId("price");
        expect(SaleBanner).toHaveTextContent("Sale starting in");
        expect(Price[0]).toHaveTextContent("999");
        expect(Price[1]).toHaveTextContent("799");
        expect(screen.queryByTestId("sale-tag")).not.toBeInTheDocument();

		await wait(4000);
        SaleBanner = screen.getByTestId("sale-banner");
        Price = screen.getAllByTestId("price");
        expect(SaleBanner).toHaveTextContent("Sale starting in");
        expect(Price[0]).toHaveTextContent("999");
        expect(Price[1]).toHaveTextContent("799");
        expect(screen.queryByTestId("sale-tag")).not.toBeInTheDocument();

        await wait(2000);
        SaleBanner = screen.getByTestId("sale-banner");
        Price = screen.getAllByTestId("price");
        expect(SaleBanner).not.toHaveTextContent("Sale starting in");
        expect(SaleBanner).toHaveTextContent("Sale is ON!");
        expect(Price[0]).toHaveTextContent("699.3");
        expect(Price[1]).toHaveTextContent("559.3");
        expect(screen.getAllByTestId("sale-tag")[0]).toBeInTheDocument();
        expect(screen.getAllByTestId("sale-tag")[1]).toBeInTheDocument();
	}, 10000);
});
