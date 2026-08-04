import { expect, test } from "@playwright/test";

test("selects a note from the knowledge workspace", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { name: "Product brief" }),
	).toBeVisible();
	await page.getByRole("button", { name: /Database patterns/ }).click();
	await expect(
		page.getByRole("heading", { name: "Database patterns" }),
	).toBeVisible();
	await expect(page.locator(".crumb")).toHaveText(
		"Notes / Database patterns",
	);
});
