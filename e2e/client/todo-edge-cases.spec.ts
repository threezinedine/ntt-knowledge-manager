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

async function loginAndGoToTodo(page: import("@playwright/test").Page) {
	await page.goto("/#/login");
	await page.getByLabel("Token").fill(DEV_TOKEN);
	await page.getByRole("button", { name: "Log in" }).click();
	await expect(
		page.getByRole("heading", { name: "Workspace" }),
	).toBeVisible();
	await expect(page.getByText("Logged in")).not.toBeVisible();

	await page.getByRole("img", { name: "User avatar" }).click();
	await page.getByRole("menuitem", { name: "Todo" }).click();
}

test("add button is disabled when input is empty", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await expect(page.getByRole("button", { name: "Add" })).toBeDisabled();

	// whitespace-only also keeps it disabled
	await page.getByPlaceholder("New task…").fill("   ");
	await expect(page.getByRole("button", { name: "Add" })).toBeDisabled();
});

test("pressing Enter in the input creates a task", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await page.getByPlaceholder("New task…").fill("Enter-key task");
	await page.getByPlaceholder("New task…").press("Enter");

	await expect(page.locator("li").getByText("Enter-key task")).toBeVisible();
});

test("input clears after creating a task", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await page.getByPlaceholder("New task…").fill("Clearable task");
	await page.getByRole("button", { name: "Add" }).click();

	await expect(page.locator("li").getByText("Clearable task")).toBeVisible();
	await expect(page.getByPlaceholder("New task…")).toHaveValue("");
});

test("default priority is medium", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await expect(page.locator("select")).toHaveValue("medium");

	await page.getByPlaceholder("New task…").fill("Default priority task");
	await page.getByRole("button", { name: "Add" }).click();

	await expect(page.locator("li").getByText("medium")).toBeVisible();
});

test("task cycles through all three statuses: todo → in_progress → done → todo", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await page.getByPlaceholder("New task…").fill("Cycle task");
	await page.getByRole("button", { name: "Add" }).click();

	const task = page.locator("li").filter({ hasText: "Cycle task" });
	const statusBtn = task.getByRole("button", { name: /Status/ });

	// todo → in_progress (○ → ◑)
	await expect(statusBtn).toHaveText("○");
	await statusBtn.click();
	await expect(statusBtn).toHaveText("◑");

	// in_progress → done (◑ → ●)
	await statusBtn.click();
	await expect(statusBtn).toHaveText("●");

	// done → todo (● → ○)
	await statusBtn.click();
	await expect(statusBtn).toHaveText("○");
});

test("done tasks have strikethrough styling", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await page.getByPlaceholder("New task…").fill("Strikethrough task");
	await page.getByRole("button", { name: "Add" }).click();

	const task = page.locator("li").filter({ hasText: "Strikethrough task" });

	// toggle to done: todo → in_progress → done
	await task.getByRole("button", { name: /Status/ }).click();
	await task.getByRole("button", { name: /Status/ }).click();

	await expect(task).toHaveClass(/itemDone/);
});

test("filtered view shows empty state when no tasks match", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await page.getByPlaceholder("New task…").fill("Only todo task");
	await page.getByRole("button", { name: "Add" }).click();

	// filter to "Done" — no tasks match
	await page.getByRole("tab", { name: "Done" }).click();
	await expect(page.getByText("No tasks yet")).toBeVisible();

	// filter to "In progress" — no tasks match
	await page.getByRole("tab", { name: "In progress" }).click();
	await expect(page.getByText("No tasks yet")).toBeVisible();

	// back to All — task is there
	await page.getByRole("tab", { name: "All" }).click();
	await expect(page.locator("li").getByText("Only todo task")).toBeVisible();
});

test("can create tasks with all three priority levels", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	for (const priority of ["high", "medium", "low"]) {
		await page.getByPlaceholder("New task…").fill(`${priority} priority task`);
		await page.locator("select").selectOption(priority);
		await page.getByRole("button", { name: "Add" }).click();
	}

	await expect(page.locator("li")).toHaveCount(3);
	await expect(page.locator("li").getByText("high", { exact: true })).toBeVisible();
	await expect(page.locator("li").getByText("medium", { exact: true })).toBeVisible();
	await expect(page.locator("li").getByText("low", { exact: true })).toBeVisible();
});

test("delete all tasks returns to empty state", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	// create two tasks
	await page.getByPlaceholder("New task…").fill("Task A");
	await page.getByRole("button", { name: "Add" }).click();
	await page.getByPlaceholder("New task…").fill("Task B");
	await page.getByRole("button", { name: "Add" }).click();
	await expect(page.locator("li")).toHaveCount(2);

	// delete both
	await page.locator("li").filter({ hasText: "Task A" }).getByRole("button", { name: "Delete task" }).click();
	await expect(page.locator("li")).toHaveCount(1);
	await page.locator("li").filter({ hasText: "Task B" }).getByRole("button", { name: "Delete task" }).click();

	await expect(page.getByText("No tasks yet")).toBeVisible();
});

test("new task appears at the top of the list", async ({ page }) => {
	await page.goto("/");
	await clearAllTasks(page);
	await loginAndGoToTodo(page);

	await page.getByPlaceholder("New task…").fill("First task");
	await page.getByRole("button", { name: "Add" }).click();

	await page.getByPlaceholder("New task…").fill("Second task");
	await page.getByRole("button", { name: "Add" }).click();

	const items = page.locator("li");
	await expect(items.first()).toContainText("Second task");
	await expect(items.last()).toContainText("First task");
});
