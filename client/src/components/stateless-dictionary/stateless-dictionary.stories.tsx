import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessDictionary, type DictionaryEntry } from "./stateless-dictionary";

const MOCK_ENTRY: DictionaryEntry = {
	word: "abandon",
	phonetic: "/əˈbæn.dən/",
	audio_url: "https://api.dictionaryapi.dev/media/pronunciations/en/abandon-us.mp3",
	meanings: [
		{
			partOfSpeech: "verb",
			definitions: [
				{
					definition: "To give up or relinquish control of",
					example: "They abandoned the project.",
				},
				{
					definition: "To leave behind or desert",
					example: "He abandoned his family.",
				},
			],
		},
		{
			partOfSpeech: "noun",
			definitions: [
				{
					definition: "A yielding to natural impulses",
					example: "",
				},
			],
		},
	],
	vietnamese_meaning: "bỏ rơi, từ bỏ",
};

const meta = {
	title: "Components/StatelessDictionary",
	component: StatelessDictionary,
	args: {
		query: "",
		suggestions: [],
		entry: null,
		loading: false,
		error: null,
		onQueryChange: () => {},
		onSubmit: () => {},
		onSuggestionClick: () => {},
	},
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 500, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessDictionary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSuggestions: Story = {
	args: {
		query: "aban",
		suggestions: [
			{ id: 1, word: "abandon", phonetic: "/əˈbæn.dən/" },
			{ id: 2, word: "abandoned", phonetic: "/əˈbæn.dənd/" },
		],
	},
};

export const LookupPrompt: Story = {
	args: {
		query: "newword",
	},
};

export const Loading: Story = {
	args: {
		query: "abandon",
		loading: true,
	},
};

export const Error: Story = {
	args: {
		query: "xyznotaword",
		error: 'Could not find "xyznotaword"',
		similarWords: ["xylophone"],
	},
};

export const EnglishTab: Story = {
	args: {
		query: "abandon",
		entry: MOCK_ENTRY,
		similarWords: ["abandonment", "abandoned", "abolish", "abscond", "abstain"],
	},
};

export const NoVietnamese: Story = {
	args: {
		query: "abandon",
		entry: { ...MOCK_ENTRY, vietnamese_meaning: "" },
	},
};
