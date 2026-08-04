import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  envDir: path.resolve(import.meta.dirname, ".."),
  plugins: [react()],
});
