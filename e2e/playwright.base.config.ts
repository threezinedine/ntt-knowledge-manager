import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./client",
	fullyParallel: false,
	workers: 1,
	timeout: 60_000,
	expect: { timeout: 10_000 },
	reporter: "list",
	use: {
		browserName: "chromium",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		actionTimeout: 15_000,
		navigationTimeout: 30_000,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
