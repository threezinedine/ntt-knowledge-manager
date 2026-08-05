import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: "./",
	envDir: path.resolve(import.meta.dirname, ".."),
	plugins: [react()],
	resolve: {
		dedupe: ["react", "react-dom"],
	},
	test: {
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts",
	},
});
