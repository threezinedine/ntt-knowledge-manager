import { useCallback, useRef } from "react";
import { StatelessDictionary, type DictionarySuggestion } from "../../../components";
import { useDictionaryStore } from "../store/dictionary-store";

type DictionaryProps = {
	className?: string;
};

export function Dictionary({ className }: DictionaryProps) {
	const { query, entry, vietnameseMeaning, similarWords, suggestions, loading, error, setQuery, lookup } =
		useDictionaryStore();

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioUrlRef = useRef("");

	const speakWord = useCallback((word: string) => {
		if (!window.speechSynthesis) return;
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(word);
		utterance.lang = "en-US";
		window.speechSynthesis.speak(utterance);
	}, []);

	const playAudio = useCallback(() => {
		if (audioUrlRef.current && audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.play().catch(() => {});
			return;
		}
		const word = useDictionaryStore.getState().entry?.word;
		if (word) speakWord(word);
	}, [speakWord]);

	const handleSubmit = useCallback(
		(word: string) => {
			audioRef.current = null;
			audioUrlRef.current = "";
			const pendingAudio = new Audio();
			lookup(word).then(() => {
				const result = useDictionaryStore.getState().entry;
				if (result?.audio_url) {
					pendingAudio.src = result.audio_url;
					audioRef.current = pendingAudio;
					audioUrlRef.current = result.audio_url;
					pendingAudio.play().catch(() => {});
				} else if (result) {
					speakWord(result.word);
				}
			});
		},
		[lookup, speakWord],
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
				vietnamese_meaning: vietnameseMeaning,
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
