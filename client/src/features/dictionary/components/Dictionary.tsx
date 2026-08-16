import { useCallback, useRef } from "react";
import { StatelessDictionary, type DictionarySuggestion } from "../../../components";
import { useDictionaryStore } from "../store/dictionary-store";

type DictionaryProps = {
	className?: string;
};

export function Dictionary({ className }: DictionaryProps) {
	const { query, entry, similarWords, suggestions, loading, error, setQuery, lookup } =
		useDictionaryStore();

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioUrlRef = useRef("");

	const playAudio = useCallback((url?: string) => {
		const targetUrl = url ?? audioUrlRef.current;
		if (!targetUrl) return;
		if (audioUrlRef.current !== targetUrl || !audioRef.current) {
			audioRef.current = new Audio(targetUrl);
			audioUrlRef.current = targetUrl;
		}
		audioRef.current.currentTime = 0;
		audioRef.current.play().catch(() => {});
	}, []);

	const handleSubmit = useCallback(
		(word: string) => {
			const pendingAudio = new Audio();
			lookup(word).then(() => {
				const result = useDictionaryStore.getState().entry;
				if (result?.audio_url) {
					pendingAudio.src = result.audio_url;
					audioRef.current = pendingAudio;
					audioUrlRef.current = result.audio_url;
					pendingAudio.play().catch(() => {});
				}
			});
		},
		[lookup],
	);

	const handleSuggestionClick = useCallback(
		(suggestion: DictionarySuggestion) => {
			handleSubmit(suggestion.word);
		},
		[handleSubmit],
	);

	const mappedSuggestions: DictionarySuggestion[] = suggestions.map((s, i) => ({
		id: i,
		word: s.word,
		phonetic: "",
	}));

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
			suggestions={mappedSuggestions}
			similarWords={similarWords}
			entry={mappedEntry}
			loading={loading}
			error={error}
			onQueryChange={setQuery}
			onSubmit={handleSubmit}
			onSuggestionClick={handleSuggestionClick}
			onPlayAudio={() => playAudio()}
		/>
	);
}
