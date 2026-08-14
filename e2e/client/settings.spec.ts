import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const DEV_TOKEN = "dev-fix-token";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATAR_PATH = path.join(__dirname, "..", "fixtures", "avatar.png");

async function resetSettings(page: import("@playwright/test").Page) {
	const baseURL = page.url().startsWith("http")
		? new URL(page.url()).origin
		: "";
	await page.request.patch(`${baseURL}/api/settings`, {
		headers: { Authorization: `Bearer ${DEV_TOKEN}` },
		data: { theme: "light", nickname: "" },
	});
	await page.request.delete(`${baseURL}/api/settings/avatar`, {
		headers: { Authorization: `Bearer ${DEV_TOKEN}` },
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

test("settings page shows avatar upload area", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	await expect(
		page.getByRole("button", { name: "Upload avatar" }),
	).toBeVisible();
});

test("can upload an avatar image", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	const fileInput = page.locator('input[type="file"]');
	await fileInput.setInputFiles(AVATAR_PATH);

	await expect(page.getByAltText("Avatar preview")).toHaveAttribute(
		"src",
		/^blob:/,
	);

	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();
});

test("uploaded avatar persists after reload", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	const fileInput = page.locator('input[type="file"]');
	await fileInput.setInputFiles(AVATAR_PATH);
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(page.getByAltText("Avatar preview")).toHaveAttribute(
		"src",
		/^data:image\/png;base64,/,
	);
});

test("can remove an uploaded avatar", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	const fileInput = page.locator('input[type="file"]');
	await fileInput.setInputFiles(AVATAR_PATH);
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(
		page.getByRole("button", { name: "Remove avatar" }),
	).toBeVisible();

	await page.getByRole("button", { name: "Remove avatar" }).click();
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(
		page.getByRole("button", { name: "Remove avatar" }),
	).toBeHidden();
});

test("can upload avatar and update settings together", async ({ page }) => {
	await page.goto("/");
	await resetSettings(page);
	await login(page);
	await goToSettings(page);

	const fileInput = page.locator('input[type="file"]');
	await fileInput.setInputFiles(AVATAR_PATH);
	await page.getByLabel("Nickname").fill("AvatarUser");
	await page.getByLabel("Theme").selectOption("dark");
	await page.getByRole("button", { name: "Save" }).click();
	await expect(page.getByText("Settings saved")).toBeVisible();

	await page.reload();
	await expect(page.getByAltText("Avatar preview")).toHaveAttribute(
		"src",
		/^data:image\/png;base64,/,
	);
	await expect(page.getByLabel("Nickname")).toHaveValue("AvatarUser");
	await expect(page.getByLabel("Theme")).toHaveValue("dark");
});

test("settings require authentication", async ({ page }) => {
	await page.goto("/#/settings");

	await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});
