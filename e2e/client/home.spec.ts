import { expect, test } from "@playwright/test";

test("loads the home page", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", {
			name: "Turn scattered notes into decisions",
		}),
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "How it works" }),
	).toBeVisible();
});
