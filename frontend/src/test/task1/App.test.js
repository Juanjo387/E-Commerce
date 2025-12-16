import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "@jest/globals";
import fetchMock from "fetch-mock";
import Navbar from "../../components/Navbar/Navbar";
import { MemoryRouter } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";

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

global.console.warn = jest.fn();
global.console.error = jest.fn();

describe("Feature Testing", () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	it("Correct Search Recommendation Dropdown Appears", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/products/search?query=tv`, {
			status: 200,
			body: [
				{
					_id: "663f41e260491cdc32ba0c0b",
					sNo: 3,
					name: "Super 4k TV 1",
					price: 1499,
					description: "Ultra HD Smart TV with stunning visuals",
					tags: "electronics, television, tv",
				},
				{
					_id: "663f41e260491cdc32ba0c0f",
					sNo: 7,
					name: "Super OLED TV X2",
					price: 1999,
					description:
						"Premium OLED TV with stunning picture quality",
					tags: "electronics, television, entertainment",
				},
			],
		});

		await act(async () => {
			render(
				<MemoryRouter>
					<Navbar />
				</MemoryRouter>,
			);
		});

		const searchBar = screen.getByTestId("search-bar");
		fireEvent.change(searchBar, {
			target: { value: "tv" },
		});
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
		expect(screen.getByTestId("navbar-search-results").textContent).toBe(
			"Super 4k TV 1Super OLED TV X2",
		);
	});

	it("Refresh the search after every 2 characters is correctly implemented", async () => {
		const baseURL = generateBaseURL();
		fetchMock.getOnce(`${baseURL}/api/products/search?query=sp`, {
			status: 200,
			body: [
				{
					_id: "663f41e260491cdc32ba0c11",
					sNo: 9,
					name: "Ultra Sports Shoes",
					price: 180,
					description:
						"Comfortable running shoes with responsive cushioning",
					tags: "footwear, running shoes, shoes, sneakers",
				},
				{
					_id: "663f41e260491cdc32ba0c12",
					sNo: 10,
					name: "Smart Speaker",
					price: 49,
					description: "Smart speaker with voice assistant",
					tags: "electronics, smart home, productivity",
				},
			],
		});
		fetchMock.getOnce(`${baseURL}/api/products/search?query=spo`, {
			status: 200,
			body: [
				{
					_id: "663f41e260491cdc32ba0c11",
					sNo: 9,
					name: "Ultra Sports Shoes",
					price: 180,
					description:
						"Comfortable running shoes with responsive cushioning",
					tags: "footwear, running shoes, shoes, sneakers",
				},
			],
		});

		await act(async () => {
			render(
				<MemoryRouter>
					<Navbar />
				</MemoryRouter>,
			);
		});

		const searchBar = screen.getByTestId("search-bar");
		fireEvent.change(searchBar, {
			target: { value: "sp" },
		});
		fireEvent.change(searchBar, {
			target: { value: "spo" },
		});
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
		expect(screen.getByTestId("navbar-search-results").textContent).toBe(
			"Ultra Sports ShoesSmart Speaker",
		);
	});
});
