import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatelessDictionarySearch, type DictionarySuggestion } from "./stateless-dictionary-search";
import type { DictionaryEntry } from "../stateless-dictionary";

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

const ALL_SUGGESTIONS: DictionarySuggestion[] = [
	{ id: 1, word: "abandon", phonetic: "/əˈbæn.dən/" },
	{ id: 2, word: "abandoned", phonetic: "/əˈbæn.dənd/" },
	{ id: 3, word: "ability", phonetic: "/əˈbɪl.ɪ.ti/" },
	{ id: 4, word: "about", phonetic: "/əˈbaʊt/" },
	{ id: 5, word: "above", phonetic: "/əˈbʌv/" },
];

const meta = {
	title: "Components/StatelessDictionarySearch",
	component: StatelessDictionarySearch,
	args: {
		query: "",
		suggestions: [],
		entry: null,
		loading: false,
		error: null,
		onQueryChange: () => {},
		onSubmit: () => {},
		onSuggestionClick: () => {},
		onPlayAudio: () => {},
		onAdd: (word: string) => alert(`Add: ${word}`),
	},
	decorators: [
		(Story) => (
			<div style={{ width: 600, height: 500, border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof StatelessDictionarySearch>;

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
		onSuggestionClick: (s) => alert(`Selected: ${s.word}`),
		onSubmit: (word) => alert(`Submit: ${word}`),
	},
};

export const Interactive: Story = {
	render: () => {
		const [query, setQuery] = useState("");
		const [entry, setEntry] = useState<DictionaryEntry | null>(null);

		const filtered = query.length >= 2
			? ALL_SUGGESTIONS.filter((s) => s.word.startsWith(query.toLowerCase()))
			: [];

		const handleSubmit = (word: string) => {
			if (word === "abandon") {
				setEntry(MOCK_ENTRY);
			} else {
				setEntry({
					word,
					phonetic: "",
					audio_url: "",
					meanings: [{ partOfSpeech: "noun", definitions: [{ definition: `Definition of ${word}`, example: "" }] }],
					vietnamese_meaning: "",
				});
			}
		};

		const handleSuggestionClick = (suggestion: DictionarySuggestion) => {
			setQuery(suggestion.word);
			handleSubmit(suggestion.word);
		};

		return (
			<StatelessDictionarySearch
				query={query}
				suggestions={entry ? [] : filtered}
				entry={entry}
				loading={false}
				error={null}
				onQueryChange={(q) => { setQuery(q); if (entry) setEntry(null); }}
				onSubmit={handleSubmit}
				onSuggestionClick={handleSuggestionClick}
				onAdd={(word) => alert(`Add: ${word}`)}
			/>
		);
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

export const WithEntry: Story = {
	args: {
		query: "abandon",
		entry: MOCK_ENTRY,
		similarWords: ["abandonment", "abandoned", "abolish", "abscond", "abstain"],
	},
};
