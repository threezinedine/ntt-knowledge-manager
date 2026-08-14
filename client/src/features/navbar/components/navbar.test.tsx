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

	it("renders only the brand in brand variant", () => {
		render(<Navbar variant="brand" />);

		expect(screen.getByText("Knowledge")).toBeVisible();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});

	it("shows the account menu items when authenticated", () => {
		useAuthStore.setState({ token: "token-1", status: "authenticated" });
		render(<Navbar />);

		fireEvent.click(screen.getByRole("img", { name: "User avatar" }));

		expect(
			screen.getByRole("menuitem", { name: "Settings" }),
		).toBeVisible();
		expect(
			screen.getByRole("menuitem", { name: "Workspace" }),
		).toBeVisible();
		expect(screen.getByRole("menuitem", { name: "Logout" })).toBeVisible();
	});

	it("navigates to the workspace when Workspace is selected", () => {
		useAuthStore.setState({ token: "token-1", status: "authenticated" });
		render(<Navbar />);

		fireEvent.click(screen.getByRole("img", { name: "User avatar" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Workspace" }));

		expect(window.location.hash).toBe("#/workspace");
	});

	it("opens a confirmation modal when Logout is selected", () => {
		useAuthStore.setState({ token: "token-1", status: "authenticated" });
		render(<Navbar />);

		fireEvent.click(screen.getByRole("img", { name: "User avatar" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));

		expect(screen.getByRole("dialog")).toBeVisible();
		expect(
			screen.getByText("Are you sure you want to log out?"),
		).toBeVisible();
	});

	it("does not log out when Cancel is clicked in the modal", () => {
		useAuthStore.setState({ token: "token-1", status: "authenticated" });
		render(<Navbar />);

		fireEvent.click(screen.getByRole("img", { name: "User avatar" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		expect(useAuthStore.getState().token).toBe("token-1");
		expect(useAuthStore.getState().status).toBe("authenticated");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("logs out and returns home when Yes is clicked in the modal", () => {
		useAuthStore.setState({ token: "token-1", status: "authenticated" });
		render(<Navbar />);

		fireEvent.click(screen.getByRole("img", { name: "User avatar" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));
		fireEvent.click(screen.getByRole("button", { name: "Yes" }));

		expect(useAuthStore.getState().token).toBeNull();
		expect(useAuthStore.getState().status).toBe("unauthenticated");
		expect(window.location.hash).toBe("#/");
	});
});
