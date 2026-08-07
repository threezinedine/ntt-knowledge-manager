import type { Preview } from "@storybook/react-vite";
// @ts-ignore
import "../src/theme/theme.scss";

const preview: Preview = {
	parameters: {
		controls: { expanded: true },
	},
	globalTypes: {
		theme: {
			description: "Global theme for components",
			toolbar: {
				title: "Theme",
				icon: "mirror",
				items: [
					{ value: "light", title: "Light", icon: "sun" },
					{ value: "dark", title: "Dark", icon: "moon" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "light",
	},
	decorators: [
		(Story, context) => {
			document.documentElement.setAttribute(
				"data-theme",
				context.globals.theme ?? "light",
			);
			return Story();
		},
	],
};

export default preview;
