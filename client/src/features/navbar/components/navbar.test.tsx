import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../../auth";
import { Navbar } from "./navbar";

describe("Navbar", () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.location.hash = "";
		useAuthStore.setState({ token: null, status: "unauthenticated" });
	});

	it("shows the login button when not authenticated", () => {
		render(<Navbar />);

		expect(screen.getByRole("button", { name: "Log in" })).toBeVisible();
		expect(
			screen.queryByRole("img", { name: "User avatar" }),
		).not.toBeInTheDocument();
	});

	it("shows the avatar when authenticated", () => {
		useAuthStore.setState({ token: "token-1", status: "authenticated" });
		render(<Navbar />);

		expect(screen.getByRole("img", { name: "User avatar" })).toBeVisible();
		expect(
			screen.queryByRole("button", { name: "Log in" }),
		).not.toBeInTheDocument();
	});

	it("navigates to the login page when the login button is clicked", () => {
		render(<Navbar />);

		fireEvent.click(screen.getByRole("button", { name: "Log in" }));

		expect(window.location.hash).toBe("#/login");
	});
});
