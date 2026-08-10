import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "./stateless-navbar";

describe("Navbar", () => {
	it("renders the fixed brand logo", () => {
		render(<Navbar isAuthenticated={false} />);

		expect(screen.getByText("Knowledge")).toBeVisible();
	});

	it("shows a login button when not authenticated", () => {
		render(<Navbar isAuthenticated={false} />);

		expect(screen.getByRole("button", { name: "Log in" })).toBeVisible();
	});

	it("does not render the avatar when not authenticated", () => {
		render(<Navbar isAuthenticated={false} avatarAlt="Jane Doe" />);

		expect(
			screen.queryByRole("img", { name: "Jane Doe" }),
		).not.toBeInTheDocument();
	});

	it("calls onLoginClick when the login button is clicked", () => {
		const handleLoginClick = vi.fn();
		render(
			<Navbar isAuthenticated={false} onLoginClick={handleLoginClick} />,
		);

		fireEvent.click(screen.getByRole("button", { name: "Log in" }));
		expect(handleLoginClick).toHaveBeenCalledOnce();
	});

	it("shows only the avatar when authenticated", () => {
		render(<Navbar isAuthenticated avatarAlt="Jane Doe" />);

		expect(screen.getByRole("img", { name: "Jane Doe" })).toBeVisible();
		expect(
			screen.queryByRole("button", { name: "Log in" }),
		).not.toBeInTheDocument();
	});

	it("calls onAvatarClick when the avatar is clicked", () => {
		const handleAvatarClick = vi.fn();
		render(
			<Navbar
				isAuthenticated
				avatarAlt="Jane Doe"
				onAvatarClick={handleAvatarClick}
			/>,
		);

		fireEvent.click(screen.getByRole("img", { name: "Jane Doe" }));
		expect(handleAvatarClick).toHaveBeenCalledOnce();
	});

	it("uses a custom login label", () => {
		render(<Navbar isAuthenticated={false} loginLabel="Sign in" />);

		expect(screen.getByRole("button", { name: "Sign in" })).toBeVisible();
	});

	it("renders only the brand when variant is brand", () => {
		render(<Navbar variant="brand" isAuthenticated={false} />);

		expect(screen.getByText("Knowledge")).toBeVisible();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});

	it("opens the account menu when the avatar is clicked", () => {
		render(
			<Navbar
				isAuthenticated
				avatarAlt="Jane Doe"
				onSettingsClick={() => {}}
				onWorkspaceClick={() => {}}
				onLogoutClick={() => {}}
			/>,
		);

		fireEvent.click(screen.getByRole("img", { name: "Jane Doe" }));

		expect(
			screen.getByRole("menuitem", { name: "Settings" }),
		).toBeVisible();
		expect(
			screen.getByRole("menuitem", { name: "Workspace" }),
		).toBeVisible();
		expect(screen.getByRole("menuitem", { name: "Logout" })).toBeVisible();
		expect(screen.getByRole("separator")).toBeInTheDocument();
	});

	it("calls onSettingsClick when Settings is selected", () => {
		const handleSettingsClick = vi.fn();
		render(
			<Navbar
				isAuthenticated
				avatarAlt="Jane Doe"
				onSettingsClick={handleSettingsClick}
			/>,
		);

		fireEvent.click(screen.getByRole("img", { name: "Jane Doe" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));

		expect(handleSettingsClick).toHaveBeenCalledOnce();
	});

	it("calls onWorkspaceClick when Workspace is selected", () => {
		const handleWorkspaceClick = vi.fn();
		render(
			<Navbar
				isAuthenticated
				avatarAlt="Jane Doe"
				onWorkspaceClick={handleWorkspaceClick}
			/>,
		);

		fireEvent.click(screen.getByRole("img", { name: "Jane Doe" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Workspace" }));

		expect(handleWorkspaceClick).toHaveBeenCalledOnce();
	});

	it("calls onLogoutClick when Logout is selected", () => {
		const handleLogoutClick = vi.fn();
		render(
			<Navbar
				isAuthenticated
				avatarAlt="Jane Doe"
				onLogoutClick={handleLogoutClick}
			/>,
		);

		fireEvent.click(screen.getByRole("img", { name: "Jane Doe" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));

		expect(handleLogoutClick).toHaveBeenCalledOnce();
	});
});
