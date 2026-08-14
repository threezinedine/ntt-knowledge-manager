import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],
	addons: [],
	framework: "@storybook/react-vite",
	core: {
		disableLazyCompilation: true,
	},
	viteFinal: (config) => {
		config.server = {
			...config.server,
			hmr: false,
			watch: {
				usePolling: true,
			},
		};
		const nodeModules = path.resolve(import.meta.dirname, "../node_modules");
		config.resolve = {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				react: path.join(nodeModules, "react"),
				"react-dom": path.join(nodeModules, "react-dom"),
				"react/jsx-runtime": path.join(nodeModules, "react/jsx-runtime"),
				"react/jsx-dev-runtime": path.join(
					nodeModules,
					"react/jsx-dev-runtime",
				),
			},
			dedupe: [
				...(config.resolve?.dedupe ?? []),
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
			],
		};
		config.optimizeDeps = {
			...config.optimizeDeps,
			include: [
				...(config.optimizeDeps?.include ?? []),
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
				"codemirror",
				"@codemirror/view",
				"@codemirror/state",
				"@codemirror/lang-markdown",
				"@codemirror/language-data",
				"@codemirror/theme-one-dark",
				"@codemirror/commands",
				"@replit/codemirror-vim",
			],
		};
		return config;
	},
};

export default config;
