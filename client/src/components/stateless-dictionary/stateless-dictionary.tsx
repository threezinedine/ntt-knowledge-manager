import { useCallback, useEffect, useRef, useState } from "react";
import { SpeakerIcon } from "../../icons";
import styles from "./stateless-dictionary.module.scss";

export type DefinitionItem = {
	definition: string;
	example: string;
};

export type MeaningItem = {
	partOfSpeech: string;
	definitions: DefinitionItem[];
};

export type DictionaryEntry = {
	word: string;
	phonetic: string;
	audio_url: string;
	meanings: MeaningItem[];
	vietnamese_meaning: string;
};

export type DictionarySuggestion = {
	id: number;
	word: string;
	phonetic: string;
};

type StatelessDictionaryProps = {
	className?: string;
	query: string;
	suggestions: DictionarySuggestion[];
	entry: DictionaryEntry | null;
	loading: boolean;
	error: string | null;
	onQueryChange: (query: string) => void;
	onSubmit: (word: string) => void;
	onSuggestionClick: (suggestion: DictionarySuggestion) => void;
};

const TABS = [
	{ id: "english", label: "English" },
	{ id: "vietnamese", label: "Vietnamese" },
	{ id: "examples", label: "Examples" },
] as const;

function useAudioPlayer(url: string) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const currentUrl = useRef("");

	const play = useCallback(() => {
		if (!url) return;
		if (currentUrl.current !== url) {
			audioRef.current = new Audio(url);
			currentUrl.current = url;
		}
		audioRef.current!.currentTime = 0;
		audioRef.current!.play();
	}, [url]);

	return play;
}

function EnglishTab({
	entry,
	onPlay,
}: {
	entry: DictionaryEntry;
	onPlay: () => void;
}) {
	return (
		<div>
			<div className={styles.wordRow}>
				<div className={styles.word}>{entry.word}</div>
				{entry.audio_url && (
					<button
						type="button"
						className={styles.audioBtn}
						onClick={onPlay}
						aria-label="Play pronunciation"
					>
						<SpeakerIcon width={16} height={16} />
					</button>
				)}
			</div>
			{entry.phonetic && (
				<div className={styles.phonetic}>{entry.phonetic}</div>
			)}
			{entry.meanings.map((m) => (
				<div key={m.partOfSpeech}>
					<div className={styles.partOfSpeech}>{m.partOfSpeech}</div>
					<ol className={styles.definitionList}>
						{m.definitions.map((d) => (
							<li key={d.definition} className={styles.definitionItem}>
								{d.definition}
								{d.example && (
									<div className={styles.example}>"{d.example}"</div>
								)}
							</li>
						))}
					</ol>
				</div>
			))}
		</div>
	);
}

function VietnameseTab({ entry }: { entry: DictionaryEntry }) {
	return (
		<div>
			{entry.vietnamese_meaning ? (
				<div className={styles.vietnameseText}>
					{entry.vietnamese_meaning}
				</div>
			) : (
				<div className={styles.vietnameseEmpty}>
					No Vietnamese meaning added yet.
				</div>
			)}
		</div>
	);
}

function ExamplesTab({ entry }: { entry: DictionaryEntry }) {
	const examples = entry.meanings.flatMap((m) =>
		m.definitions
			.filter((d) => d.example)
			.map((d) => ({ partOfSpeech: m.partOfSpeech, example: d.example })),
	);

	if (examples.length === 0) {
		return <div className={styles.vietnameseEmpty}>No examples available.</div>;
	}

	return (
		<div>
			{examples.map((e) => (
				<div key={e.example} className={styles.exampleBlock}>
					<div className={styles.examplePartOfSpeech}>{e.partOfSpeech}</div>
					<div className={styles.example}>"{e.example}"</div>
				</div>
			))}
		</div>
	);
}

export function StatelessDictionary({
	className,
	query,
	suggestions,
	entry,
	loading,
	error,
	onQueryChange,
	onSubmit,
	onSuggestionClick,
}: StatelessDictionaryProps) {
	const [activeTab, setActiveTab] = useState<string>("english");
	const classes = [styles.dictionary, className].filter(Boolean).join(" ");
	const playAudio = useAudioPlayer(entry?.audio_url ?? "");
	const prevWord = useRef<string>("");

	useEffect(() => {
		if (entry && entry.audio_url && entry.word !== prevWord.current) {
			prevWord.current = entry.word;
			playAudio();
		}
	}, [entry, playAudio]);

	useEffect(() => {
		if (entry?.audio_url) {
			playAudio();
		}
	}, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && query.trim()) {
			e.preventDefault();
			onSubmit(query.trim());
		}
	};

	return (
		<div className={classes} data-testid="dictionary">
			<div className={styles.searchArea}>
				<input
					className={styles.searchInput}
					type="text"
					placeholder="Search for a word..."
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					onKeyDown={handleKeyDown}
					aria-label="Search word"
				/>
				{suggestions.length > 0 && !entry && (
					<ul className={styles.suggestions} role="listbox">
						{suggestions.map((s) => (
							<li
								key={s.id}
								className={styles.suggestionItem}
								role="option"
								aria-selected={false}
								onClick={() => onSuggestionClick(s)}
							>
								{s.word}
								{s.phonetic && (
									<span className={styles.suggestionPhonetic}>
										{s.phonetic}
									</span>
								)}
							</li>
						))}
					</ul>
				)}
				{query.trim() && !entry && suggestions.length === 0 && !loading && (
					<ul className={styles.suggestions}>
						<li
							className={styles.suggestionItem}
							onClick={() => onSubmit(query.trim())}
						>
							Look up "<strong>{query.trim()}</strong>"
						</li>
					</ul>
				)}
			</div>

			<div className={styles.content}>
				{loading && (
					<div className={styles.loading}>Looking up...</div>
				)}
				{error && !loading && (
					<div className={styles.error}>{error}</div>
				)}
				{!entry && !loading && !error && (
					<div className={styles.empty}>
						Type a word to look it up.
					</div>
				)}
				{entry && !loading && (
					<>
						<div className={styles.tabs}>
							{TABS.map((t) => (
								<button
									key={t.id}
									type="button"
									className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
									onClick={() => setActiveTab(t.id)}
								>
									{t.label}
								</button>
							))}
						</div>
						<div className={styles.tabPanel}>
							{activeTab === "english" && (
								<EnglishTab entry={entry} onPlay={playAudio} />
							)}
							{activeTab === "vietnamese" && (
								<VietnameseTab entry={entry} />
							)}
							{activeTab === "examples" && (
								<ExamplesTab entry={entry} />
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
