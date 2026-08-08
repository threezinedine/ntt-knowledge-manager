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

test("submits a valid token and returns home", async ({ page }) => {
	await page.goto("/#/login");

	await page.getByLabel("Token").fill("secret-token-123");
	await page.getByRole("button", { name: "Log in" }).click();

	await expect(
		page.getByRole("heading", {
			name: "Turn scattered notes into decisions",
		}),
	).toBeVisible();
});
