import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./client",
	fullyParallel: true,
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
