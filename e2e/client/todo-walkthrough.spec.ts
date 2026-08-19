import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const DEV_TOKEN = "dev-fix-token";

async function clearAllTasks(page: import("@playwright/test").Page) {
	const baseURL = page.url().startsWith("http")
		? new URL(page.url()).origin
		: "";
	const res = await page.request.get(`${baseURL}/api/todos/tasks?limit=100`, {
		headers: { Authorization: `Bearer ${DEV_TOKEN}` },
	});
	const { items } = await res.json();
	for (const task of items) {
		await page.request.delete(`${baseURL}/api/todos/tasks/${task.id}`, {
			headers: { Authorization: `Bearer ${DEV_TOKEN}` },
		});
	}
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

async function goToTodo(page: import("@playwright/test").Page) {
	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Todo" }).click();
}

test("todo page requires authentication", async ({ page }) => {
	await page.goto("/#/todo");

	await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("walkthrough: navigate to todo, create tasks, filter, toggle, delete", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await login(page);
	await goToTodo(page);

	// empty state
	await expect(page.getByText("No tasks yet")).toBeVisible();

	// create first task with high priority
	await page.getByPlaceholder("New task…").fill("Write unit tests");
	await page.locator("select").selectOption("high");
	await page.getByRole("button", { name: "Add" }).click();

	await expect(page.locator("li").getByText("Write unit tests")).toBeVisible();
	await expect(page.locator("li").getByText("high")).toBeVisible();
	await expect(page.getByText("No tasks yet")).not.toBeVisible();

	// create second task with low priority
	await page.getByPlaceholder("New task…").fill("Update README");
	await page.locator("select").selectOption("low");
	await page.getByRole("button", { name: "Add" }).click();

	await expect(page.locator("li").getByText("Update README")).toBeVisible();

	// create third task with medium priority
	await page.getByPlaceholder("New task…").fill("Fix login bug");
	await page.locator("select").selectOption("medium");
	await page.getByRole("button", { name: "Add" }).click();

	await expect(page.locator("li").getByText("Fix login bug")).toBeVisible();

	// all 3 tasks visible in "All" filter
	await expect(page.getByRole("tab", { name: "All" })).toHaveAttribute("aria-selected", "true");
	await expect(page.locator("li")).toHaveCount(3);

	// toggle first task from todo → in_progress
	const firstTask = page.locator("li").filter({ hasText: "Write unit tests" });
	await firstTask.getByRole("button", { name: /Status/ }).click();

	// filter to "In progress" — only the toggled task
	await page.getByRole("tab", { name: "In progress" }).click();
	await expect(page.locator("li")).toHaveCount(1);
	await expect(page.locator("li").getByText("Write unit tests")).toBeVisible();

	// toggle to done
	await firstTask.getByRole("button", { name: /Status/ }).click();

	// filter to "Done"
	await page.getByRole("tab", { name: "Done" }).click();
	await expect(page.locator("li").getByText("Write unit tests")).toBeVisible();

	// filter to "Todo" — only the 2 remaining tasks
	await page.getByRole("tab", { name: "Todo" }).click();
	await expect(page.locator("li")).toHaveCount(2);
	await expect(page.locator("li").getByText("Update README")).toBeVisible();
	await expect(page.locator("li").getByText("Fix login bug")).toBeVisible();

	// delete a task
	const readmeTask = page.locator("li").filter({ hasText: "Update README" });
	await readmeTask.getByRole("button", { name: "Delete task" }).click();
	await expect(page.locator("li").getByText("Update README")).not.toBeVisible();
	await expect(page.locator("li")).toHaveCount(1);

	// back to All — 2 tasks remain (1 done + 1 todo)
	await page.getByRole("tab", { name: "All" }).click();
	await expect(page.locator("li")).toHaveCount(2);
});

test("tasks persist after page reload", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await login(page);
	await goToTodo(page);

	// create a task
	await page.getByPlaceholder("New task…").fill("Persistent task");
	await page.getByRole("button", { name: "Add" }).click();
	await expect(page.locator("li").getByText("Persistent task")).toBeVisible();

	// reload
	await page.reload();

	// task is still there
	await expect(page.locator("li").getByText("Persistent task")).toBeVisible();
});
