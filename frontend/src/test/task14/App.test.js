import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, beforeEach, it, expect, jest, afterEach } from "@jest/globals";
import fetchMock from "fetch-mock";
import Login from "../../components/layout/Auth/Login";
import Register from "../../components/layout/Auth/Register";
import { Router, Routes, Route, MemoryRouter } from "react-router-dom";
import { generateBaseURL } from "../../../../frontend/src/utils";
import toast from "react-hot-toast";

const mockSetAuth = jest.fn();
jest.mock("../../../src/contexts/onAuth.js", () => ({
	useAuth: () => [
		{
			user: { username: "testUser" },
			token: "testToken",
			isLoading: false,
		},
		mockSetAuth,
	],
}));


jest.mock("react-hot-toast");
global.console.warn = jest.fn();
global.console.error = jest.fn();

describe("Feature Testing", () => {
	it("should display a toast error for an invalid username in the register component", async () => {
		await act(async () => {
			render(
				<MemoryRouter initialEntries={['/']}>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
				</MemoryRouter>
			);
		});

		const newUserButton = screen.getByTestId("new-user");
		fireEvent.click(newUserButton);

        let registerButton = screen.queryByTestId("register-btn");
        expect(registerButton).toBeInTheDocument();

        const nameInput = screen.getByTestId("register-name");
        fireEvent.change(nameInput, { target: { value: "test" } });

        const emailInput = screen.getByTestId("register-email");
        fireEvent.change(emailInput, { target: { value: "user@example.com" } });

        const passwordInput = screen.getByTestId("register-password");
        fireEvent.change(passwordInput, { target: { value: "Test@012" } });

        registerButton = screen.getByTestId("register-btn");
        fireEvent.click(registerButton);
        expect(toast.error).toHaveBeenCalledWith("Username must be between 5 and 30 characters");
	});

    it("should display a toast error for an invalid email in the register component", async () => {
		await act(async () => {
			render(
				<MemoryRouter >
					<Register />
				</MemoryRouter>
			);
		});

        const nameInput = screen.getByTestId("register-name");
        fireEvent.change(nameInput, { target: { value: "testuser" } });

        const emailInput = screen.getByTestId("register-email");
        fireEvent.change(emailInput, { target: { value: "user@examplecom" } });

        const passwordInput = screen.getByTestId("register-password");
        fireEvent.change(passwordInput, { target: { value: "Test@012" } });

        const registerButton = screen.getByTestId("register-btn");
        fireEvent.click(registerButton);
        expect(toast.error).toHaveBeenCalledWith("Invalid email format");
	});

    it("should display a toast error for an invalid password case one", async () => {
		await act(async () => {
			render(
				<MemoryRouter >
					<Register />
				</MemoryRouter>
			);
		});

        const nameInput = screen.getByTestId("register-name");
        fireEvent.change(nameInput, { target: { value: "testuser" } });

        const emailInput = screen.getByTestId("register-email");
        fireEvent.change(emailInput, { target: { value: "user@example.com" } });

        const passwordInput = screen.getByTestId("register-password");
        fireEvent.change(passwordInput, { target: { value: "test#012" } });

        const registerButton = screen.getByTestId("register-btn");
        fireEvent.click(registerButton);
        expect(toast.error).toHaveBeenCalledWith("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character");
	});

    it("should display a toast error for an invalid password case two", async () => {
		await act(async () => {
			render(
				<MemoryRouter >
					<Register />
				</MemoryRouter>
			);
		});

        const nameInput = screen.getByTestId("register-name");
        fireEvent.change(nameInput, { target: { value: "testuser" } });

        const emailInput = screen.getByTestId("register-email");
        fireEvent.change(emailInput, { target: { value: "user@example.com" } });

        const passwordInput = screen.getByTestId("register-password");
        fireEvent.change(passwordInput, { target: { value: "test@test" } });

        const registerButton = screen.getByTestId("register-btn");
        fireEvent.click(registerButton);
        expect(toast.error).toHaveBeenCalledWith("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character");
	});

	it("should call the register API and navigate to login on successful registration", async () => {
		const mockRegisterResponse = {
			success: true,
			user: { username: "testuser" },
			token: "testToken",
		};
		fetchMock.postOnce(`${generateBaseURL()}/api/auth/register`, mockRegisterResponse);

		await act(async () => {
			render(
				<MemoryRouter initialEntries={['/register']}>
					<Routes>
						<Route path="/register" element={<Register />} />
					</Routes>
				</MemoryRouter>
			);
		});

		const nameInput = screen.getByTestId("register-name");
		const emailInput = screen.getByTestId("register-email");
		const passwordInput = screen.getByTestId("register-password");
		const registerButton = screen.getByTestId("register-btn");

		fireEvent.change(nameInput, { target: { value: "testuser" } });
		fireEvent.change(emailInput, { target: { value: "user@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "Test@012" } });
		fireEvent.click(registerButton);

		expect(fetchMock.called(`${generateBaseURL()}/api/auth/register`)).toBe(true);
		expect(fetchMock.lastCall(`${generateBaseURL()}/api/auth/register`)[1].body).toEqual(JSON.stringify({
			username: "testuser",
			email: "user@example.com",
			password: "Test@012",
		}));
	});

	afterEach(() => {
		fetchMock.restore();
	});
});
