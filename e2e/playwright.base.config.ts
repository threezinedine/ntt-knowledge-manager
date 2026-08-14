import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./client",
	fullyParallel: false,
	workers: 1,
	reporter: "list",
	use: {
		browserName: "chromium",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
