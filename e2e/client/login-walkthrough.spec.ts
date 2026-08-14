import { expect, test } from "@playwright/test";

test("navigates from the home page to the login page", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Log in" }).click();

	await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
	await expect(page.getByLabel("Token")).toBeVisible();
});

test("navigates back to home from the login page", async ({ page }) => {
	await page.goto("/#/login");

	await page.getByRole("link", { name: /back to home/i }).click();

	await expect(
		page.getByRole("heading", {
			name: "Turn scattered notes into decisions",
		}),
	).toBeVisible();
});

test("submits a valid token and enters the workspace", async ({ page }) => {
	await page.goto("/#/login");

	// matches the dev server's FIX_TOKEN (.dev.env)
	await page.getByLabel("Token").fill("dev-fix-token");
	await page.getByRole("button", { name: "Log in" }).click();

	await expect(
		page.getByRole("heading", { name: "Workspace" }),
	).toBeVisible();

	await expect(page.getByText("Logged in")).toBeVisible();
});

test("full walkthrough: login, update settings, logout", async ({ page }) => {
	await page.goto("/#/login");
	await page.getByLabel("Token").fill("dev-fix-token");
	await page.getByRole("button", { name: "Log in" }).click();
	await expect(
		page.getByRole("heading", { name: "Workspace" }),
	).toBeVisible();
	await expect(page.getByText("Logged in")).not.toBeVisible();

	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Settings" }).click();
	await expect(page.locator("h1", { hasText: "Settings" })).toBeVisible();

	await page.getByLabel("Nickname").fill("Walkthrough User");
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Logout" }).click();
	await page.getByRole("button", { name: "Yes" }).click();
	await expect(page.getByText("Logged out")).toBeVisible();
});
