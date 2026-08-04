import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.base.config";

export default defineConfig(baseConfig, {
	use: { ...baseConfig.use, baseURL: "http://127.0.0.1:8000" },
});
