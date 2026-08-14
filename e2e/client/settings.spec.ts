import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const DEV_TOKEN = "dev-fix-token";

async function resetSettings(page: import("@playwright/test").Page) {
	const baseURL = page.url().startsWith("http")
		? new URL(page.url()).origin
		: "";
	await page.request.patch(`${baseURL}/api/settings`, {
		headers: { Authorization: `Bearer ${DEV_TOKEN}` },
		data: { theme: "light", nickname: "" },
	});
}

async function login(page: import("@playwright/test").Page) {
	await page.goto("/#/login");
	await page.getByLabel("Token").fill(DEV_TOKEN);
	await page.getByRole("button", { name: "Log in" }).click();
	await expect(
		page.getByRole("heading", { name: "Workspace" }),
	).toBeVisible();
	await expect(page.getByText("Logged in")).not.toBeVisible();
}

async function goToSettings(page: import("@playwright/test").Page) {
	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Settings" }).click();
	await expect(
		page.getByRole("heading", { name: "Settings" }),
	).toBeVisible();
}

test("settings page loads with default values", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await expect(page.getByLabel("Theme")).toHaveValue("light");
	await expect(page.getByLabel("Nickname")).toHaveValue("");
});

test("can update the theme setting", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await page.getByLabel("Theme").selectOption("dark");
	await page.getByRole("button", { name: "Save" }).click();

	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(page.getByLabel("Theme")).toHaveValue("dark");
});

test("can update the nickname setting", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await page.getByLabel("Nickname").fill("Alice");
	await page.getByRole("button", { name: "Save" }).click();

	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(page.getByLabel("Nickname")).toHaveValue("Alice");
});

test("can update both settings at once", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await page.getByLabel("Theme").selectOption("dark");
	await page.getByLabel("Nickname").fill("Bob");
	await page.getByRole("button", { name: "Save" }).click();

	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(page.getByLabel("Theme")).toHaveValue("dark");
	await expect(page.getByLabel("Nickname")).toHaveValue("Bob");
});

test("changing theme to dark applies data-theme attribute", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await page.getByLabel("Theme").selectOption("dark");
	await page.getByRole("button", { name: "Save" }).click();

	await expect(page.getByText("Settings saved")).toBeVisible();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("changing theme to light applies data-theme attribute", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await page.getByLabel("Theme").selectOption("dark");
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

	await page.getByLabel("Theme").selectOption("light");
	await page.getByRole("button", { name: "Save" }).click();

	await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("theme persists after page reload", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await page.getByLabel("Theme").selectOption("dark");
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("settings require authentication", async ({ page }) => {
	await page.goto("/#/settings");

	await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});
