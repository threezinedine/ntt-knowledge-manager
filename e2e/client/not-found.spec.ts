import { expect, test } from "@playwright/test";

test("shows a 404 page for an unknown route", async ({ page }) => {
	await page.goto("/#/does-not-exist");

	await expect(
		page.getByRole("heading", { name: "Page not found" }),
	).toBeVisible();
	await expect(page.getByText("404")).toBeVisible();
});

test("navigates back to home from the 404 page", async ({ page }) => {
	await page.goto("/#/does-not-exist");

	await page.getByRole("link", { name: /back to home/i }).click();

	await expect(
		page.getByRole("heading", {
			name: "Turn scattered notes into decisions",
		}),
	).toBeVisible();
});
