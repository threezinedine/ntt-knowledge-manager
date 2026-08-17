import { useCallback, useEffect, useRef } from "react";
import { StatelessDictionary } from "../../../components";
import { useDictionaryStore } from "../store/dictionary-store";

type FreeDictionaryProps = {
	word: string;
	className?: string;
};

export function FreeDictionary({ word, className }: FreeDictionaryProps) {
	const { entry, vietnameseMeaning, similarWords, loading, error, lookup } =
		useDictionaryStore();

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioUrlRef = useRef("");

	const speakWord = useCallback((w: string) => {
		if (!window.speechSynthesis) return;
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(w);
		utterance.lang = "en-US";
		window.speechSynthesis.speak(utterance);
	}, []);

	const playAudio = useCallback(() => {
		if (audioUrlRef.current && audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.play().catch(() => {});
			return;
		}
		const w = useDictionaryStore.getState().entry?.word;
		if (w) speakWord(w);
	}, [speakWord]);

	const handleLookup = useCallback(
		(w: string) => {
			const trimmed = w.trim();
			if (!trimmed) return;
			audioRef.current = null;
			audioUrlRef.current = "";
			const pendingAudio = new Audio();
			lookup(trimmed).then(() => {
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

	useEffect(() => {
		if (word.trim()) {
			handleLookup(word);
		}
	}, [word, handleLookup]);

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
			entry={mappedEntry}
			loading={loading}
			error={error}
			similarWords={similarWords}
			onSubmit={handleLookup}
			onPlayAudio={() => playAudio()}
		/>
	);
}
