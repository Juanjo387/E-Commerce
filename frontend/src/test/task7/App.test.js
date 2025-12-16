import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";;
import AddressManager from "../../components/layout/User/AddressManager";
import Checkout from "../../components/views/checkout/Checkout";
import { MemoryRouter } from "react-router-dom";

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

describe("Feature Testing", () => {

	it("New address in dashboard works correctly", async () => {

		await act(async () => {
			render(
				<MemoryRouter>
					<AddressManager />
				</MemoryRouter>,
			);
		});

		expect(screen.getByTestId("no-addr")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("addr-btn"));

		fireEvent.change(screen.getByTestId("addr-street"), {
			target: { value: "123" },
		});
		fireEvent.change(screen.getByTestId("addr-zipCode"), {
			target: { value: "12345" },
		});
		fireEvent.click(screen.getByTestId("addr-btn"));

		fireEvent.change(screen.getByTestId("addr-street"), {
			target: { value: "123" },
		});
		fireEvent.change(screen.getByTestId("addr-city"), {
			target: { value: "Boston" },
		});
		fireEvent.change(screen.getByTestId("addr-state"), {
			target: { value: "Other" },
		});
		fireEvent.change(screen.getByTestId("addr-zipCode"), {
			target: { value: "12345" },
		});

		fireEvent.click(screen.getByTestId("addr-btn"));
		expect(screen.getByTestId("addr-street").textContent).toBe("Street: 123")
		expect(screen.getByTestId("addr-city").textContent).toBe("City: Boston")
		expect(screen.getByTestId("addr-state").textContent).toBe("State: Other")
		expect(screen.getByTestId("addr-zipCode").textContent).toBe("ZIP Code: 12345")
		fireEvent.click(screen.getByTestId("addr-edit"));

		fireEvent.change(screen.getByTestId("addr-street"), {
			target: { value: "1234" },
		});
		fireEvent.change(screen.getByTestId("addr-city"), {
			target: { value: "Boston1" },
		});
		fireEvent.change(screen.getByTestId("addr-state"), {
			target: { value: "Other1" },
		});
		fireEvent.change(screen.getByTestId("addr-zipCode"), {
			target: { value: "12FA5" },
		});
		fireEvent.click(screen.getByTestId("addr-btn"));

		expect(screen.getByTestId("addr-street").textContent).toBe("Street: 1234")
		expect(screen.getByTestId("addr-city").textContent).toBe("City: Boston1")
		expect(screen.getByTestId("addr-state").textContent).toBe("State: Other1")
		expect(screen.getByTestId("addr-zipCode").textContent).toBe("ZIP Code: 12FA5")

		fireEvent.click(screen.getByTestId("addr-delete"));
		expect(screen.getByTestId("no-addr")).toBeInTheDocument();
	});

	it("New address link between dashboard and checkout page works correctly", async () => {

		await act(async () => {
			render(
				<MemoryRouter>
					<AddressManager />
				</MemoryRouter>,
			);
		});

		expect(screen.getByTestId("no-addr")).toBeInTheDocument();
		fireEvent.click(screen.getByTestId("addr-btn"));

		fireEvent.change(screen.getByTestId("addr-street"), {
			target: { value: "123" },
		});
		fireEvent.change(screen.getByTestId("addr-city"), {
			target: { value: "Boston" },
		});
		fireEvent.change(screen.getByTestId("addr-state"), {
			target: { value: "Other" },
		});
		fireEvent.change(screen.getByTestId("addr-zipCode"), {
			target: { value: "12345" },
		});

		fireEvent.click(screen.getByTestId("addr-btn"));
		expect(screen.getByTestId("addr-street").textContent).toBe("Street: 123")
		expect(screen.getByTestId("addr-city").textContent).toBe("City: Boston")
		expect(screen.getByTestId("addr-state").textContent).toBe("State: Other")
		expect(screen.getByTestId("addr-zipCode").textContent).toBe("ZIP Code: 12345")
		fireEvent.click(screen.getByTestId("addr-edit"));

		fireEvent.change(screen.getByTestId("addr-street"), {
			target: { value: "1234" },
		});
		fireEvent.change(screen.getByTestId("addr-city"), {
			target: { value: "Boston1" },
		});
		fireEvent.change(screen.getByTestId("addr-state"), {
			target: { value: "Other1" },
		});
		fireEvent.change(screen.getByTestId("addr-zipCode"), {
			target: { value: "12FA5" },
		});
		fireEvent.click(screen.getByTestId("addr-btn"));

		expect(screen.getByTestId("addr-street").textContent).toBe("Street: 1234")
		expect(screen.getByTestId("addr-city").textContent).toBe("City: Boston1")
		expect(screen.getByTestId("addr-state").textContent).toBe("State: Other1")
		expect(screen.getByTestId("addr-zipCode").textContent).toBe("ZIP Code: 12FA5")

		await act(async () => {
			render(
				<MemoryRouter>
					<Checkout />
				</MemoryRouter>,
			);
		});

		expect(screen.getByTestId("checkout-street").value).toBe("")
		expect(screen.getByTestId("checkout-city").value).toBe("")
		expect(screen.getByTestId("checkout-state").value).toBe("")
		expect(screen.getByTestId("checkout-zipCode").value).toBe("")

		const selectAddress = screen.getByTestId("addr-select");
		const option = selectAddress.children[1];
		expect(option.textContent).toBe("1234, Boston1, Other1, 12FA5");

		await act(async () => {
			fireEvent.change(selectAddress, { target: { value: option.value } });
		});
		
		expect(screen.getByTestId("checkout-street").value).toBe("1234")
		expect(screen.getByTestId("checkout-city").value).toBe("Boston1")
		expect(screen.getByTestId("checkout-state").value).toBe("Other1")
		expect(screen.getByTestId("checkout-zipCode").value).toBe("12FA5")
	});
});
