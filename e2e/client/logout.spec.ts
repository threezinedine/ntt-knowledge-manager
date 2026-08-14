import { expect, test } from "@playwright/test";

function loginAndGoToWorkspace(page: import("@playwright/test").Page) {
	return async () => {
		await page.goto("/#/login");
		await page.getByLabel("Token").fill("dev-fix-token");
		await page.getByRole("button", { name: "Log in" }).click();
		await expect(
			page.getByRole("heading", { name: "Workspace" }),
		).toBeVisible();
	};
}

test("clicking Logout opens a confirmation modal", async ({ page }) => {
	await loginAndGoToWorkspace(page)();

	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Logout" }).click();

	await expect(page.getByRole("dialog")).toBeVisible();
	await expect(
		page.getByText("Are you sure you want to log out?"),
	).toBeVisible();
});

test("cancelling the logout modal keeps the user authenticated", async ({
	page,
}) => {
	await loginAndGoToWorkspace(page)();

	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Logout" }).click();
	await page.getByRole("button", { name: "Cancel" }).click();

	await expect(page.getByRole("dialog")).not.toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Workspace" }),
	).toBeVisible();

	const token = await page.evaluate(() =>
		window.localStorage.getItem("knowledge-manager-token"),
	);
	expect(token).not.toBeNull();
});

test("confirming logout clears the token and redirects to home", async ({
	page,
}) => {
	await loginAndGoToWorkspace(page)();

	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Logout" }).click();
	await page.getByRole("button", { name: "Yes" }).click();

	await expect(
		page.getByRole("heading", {
			name: "Turn scattered notes into decisions",
		}),
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();

	const toast = page.getByRole("alert");
	await expect(toast).toBeVisible();
	await expect(toast).toContainText("Logged out");

	const token = await page.evaluate(() =>
		window.localStorage.getItem("knowledge-manager-token"),
	);
	expect(token).toBeNull();
});
