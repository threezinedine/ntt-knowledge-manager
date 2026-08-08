import { expect, test } from "@playwright/test";

test("shows a required error when submitting an empty login form", async ({
	page,
}) => {
	await page.goto("/#/login");

	await page.getByRole("button", { name: "Log in" }).click();

	await expect(page.getByText("This field is required.")).toHaveCount(1);
	await expect(page.getByLabel("Token")).toHaveAttribute(
		"aria-invalid",
		"true",
	);
});

test("clears the required error once a token is entered", async ({ page }) => {
	await page.goto("/#/login");

	await page.getByRole("button", { name: "Log in" }).click();
	await expect(page.getByText("This field is required.")).toHaveCount(1);

	await page.getByLabel("Token").fill("secret-token-123");

	await expect(page.getByText("This field is required.")).toHaveCount(0);
	await expect(page.getByLabel("Token")).not.toHaveAttribute(
		"aria-invalid",
		"true",
	);
});

test("redirects to login when accessing the workspace without a token", async ({
	page,
}) => {
	await page.goto("/#/workspace");

	await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("redirects to login and clears an invalid stored token", async ({
	page,
}) => {
	await page.addInitScript(() => {
		window.localStorage.setItem("knowledge-manager-token", "bogus-token");
	});
	await page.goto("/#/workspace");

	await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();

	const token = await page.evaluate(() =>
		window.localStorage.getItem("knowledge-manager-token"),
	);
	expect(token).toBeNull();
});
