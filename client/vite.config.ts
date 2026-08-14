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
	// bind-mounted volumes in Docker don't reliably emit inotify events
	server: {
		allowedHosts: ["dev.ntt-space.org", "nginx-local"],
		watch: {
			usePolling: true,
			interval: 300,
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts",
	},
});
