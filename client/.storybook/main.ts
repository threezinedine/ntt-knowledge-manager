import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],
	addons: [],
	framework: "@storybook/react-vite",
	viteFinal: (config) => {
		config.server = {
			...config.server,
			hmr: false,
		};
		return config;
	},
};

export default config;
