import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessTranslator } from "./stateless-translator";

const meta = {
	title: "Components/StatelessTranslator",
	component: StatelessTranslator,
	args: {
		result: null,
		loading: false,
		error: null,
	},
	decorators: [
		(Story) => (
			<div style={{ width: 500, height: 300, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessTranslator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
	args: { loading: true },
};

export const Error: Story = {
	args: { error: "Translation failed" },
};

export const WithResult: Story = {
	args: {
		result: {
			sourceText: "The quick brown fox jumps over the lazy dog",
			translatedText: "Con cáo nâu nhanh nhẹn nhảy qua con chó lười",
			sourceLang: "English",
			targetLang: "Vietnamese",
		},
	},
};
