import { useCallback, useEffect, useRef, useState } from "react";
import { StatelessDictionary } from "../../../components";
import { lookupWord, getSimilarWords, type DictionaryResult } from "../apis/vocabulary-api";
import { translateToVietnamese } from "../apis/translate";

type FreeDictionaryProps = {
	word: string;
	className?: string;
};

export function FreeDictionary({ word, className }: FreeDictionaryProps) {
	const [entry, setEntry] = useState<DictionaryResult | null>(null);
	const [vietnameseMeaning, setVietnameseMeaning] = useState("");
	const [similarWords, setSimilarWords] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		if (entry?.word) speakWord(entry.word);
	}, [speakWord, entry]);

	const handleLookup = useCallback(
		(w: string) => {
			const trimmed = w.trim();
			if (!trimmed) return;

			audioRef.current = null;
			audioUrlRef.current = "";
			setLoading(true);
			setError(null);
			setSimilarWords([]);
			setVietnameseMeaning("");

			getSimilarWords(trimmed)
				.then((similar) => setSimilarWords(similar))
				.catch(() => {});

			const pendingAudio = new Audio();
			lookupWord(trimmed)
				.then((result) => {
					setEntry(result);
					setLoading(false);

					if (result.audio_url) {
						pendingAudio.src = result.audio_url;
						audioRef.current = pendingAudio;
						audioUrlRef.current = result.audio_url;
						pendingAudio.play().catch(() => {});
					} else {
						speakWord(result.word);
					}

					const primaryDef = result.meanings[0]?.definitions[0]?.definition ?? "";
					const textToTranslate = primaryDef
						? `${result.word}: ${primaryDef}`
						: result.word;
					translateToVietnamese(textToTranslate)
						.then((translated) => setVietnameseMeaning(translated))
						.catch(() => {});
				})
				.catch(() => {
					setLoading(false);
					setError(`Could not find "${trimmed}"`);
					setEntry(null);
				});
		},
		[speakWord],
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
