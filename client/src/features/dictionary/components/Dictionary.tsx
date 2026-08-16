import { useCallback, useEffect, useRef } from "react";
import { StatelessDictionary } from "../../../components";
import { useDictionaryStore } from "../store/dictionary-store";

type DictionaryProps = {
	className?: string;
};

export function Dictionary({ className }: DictionaryProps) {
	const { query, entry, loading, error, setQuery, lookup } =
		useDictionaryStore();

	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	const handleQueryChange = useCallback(
		(value: string) => {
			setQuery(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				if (value.trim()) lookup(value.trim());
			}, 500);
		},
		[setQuery, lookup],
	);

	const handleSubmit = useCallback(
		(word: string) => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			lookup(word);
		},
		[lookup],
	);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const mappedEntry = entry
		? {
				word: entry.word,
				phonetic: entry.phonetic,
				audio_url: entry.audio_url,
				meanings: entry.meanings,
				vietnamese_meaning: "",
			}
		: null;

	return (
		<StatelessDictionary
			className={className}
			query={query}
			suggestions={[]}
			entry={mappedEntry}
			loading={loading}
			error={error}
			onQueryChange={handleQueryChange}
			onSubmit={handleSubmit}
			onSuggestionClick={() => {}}
		/>
	);
}
