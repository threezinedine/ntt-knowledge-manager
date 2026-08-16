import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { AddIcon, SpeakerIcon } from "../../icons";
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

export type StatelessDictionaryHandle = {
	focus: () => void;
	triggerAdd: () => void;
};


type StatelessDictionaryProps = {
	className?: string;
	query: string;
	suggestions: DictionarySuggestion[];
	similarWords?: string[];
	entry: DictionaryEntry | null;
	loading: boolean;
	error: string | null;
	onQueryChange: (query: string) => void;
	onSubmit: (word: string) => void;
	onSuggestionClick: (suggestion: DictionarySuggestion) => void;
	onPlayAudio?: () => void;
	onAdd?: (word: string) => void;
};

const TABS = [
	{ id: "english", label: "English" },
	{ id: "vietnamese", label: "Vietnamese" },
	{ id: "examples", label: "Examples" },
] as const;

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
				<button
					type="button"
					className={styles.audioBtn}
					onClick={onPlay}
					aria-label="Play pronunciation"
				>
					<SpeakerIcon width={16} height={16} />
				</button>
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

export const StatelessDictionary = forwardRef<StatelessDictionaryHandle, StatelessDictionaryProps>(function StatelessDictionary({
	className,
	query,
	suggestions,
	similarWords = [],
	entry,
	loading,
	error,
	onQueryChange,
	onSubmit,
	onSuggestionClick,
	onPlayAudio,
	onAdd,
}, ref) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [activeTab, setActiveTab] = useState<string>("english");
	const [highlightIndex, setHighlightIndex] = useState(-1);
	const classes = [styles.dictionary, className].filter(Boolean).join(" ");

	const showSuggestions = suggestions.length > 0 && !entry && !loading;
	const showLookupPrompt = !!(query.trim() && !entry && suggestions.length === 0 && !loading);
	const listLength = showSuggestions ? suggestions.length : showLookupPrompt ? 1 : 0;

	useImperativeHandle(ref, () => ({
		focus: () => inputRef.current?.focus(),
		triggerAdd: () => { if (entry) onAdd?.(entry.word); },
	}));

	const prevQueryRef = useRef(query);
	if (prevQueryRef.current !== query) {
		prevQueryRef.current = query;
		if (highlightIndex !== -1) setHighlightIndex(-1);
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown" && listLength > 0) {
			e.preventDefault();
			setHighlightIndex((i) => (i + 1) % listLength);
			return;
		}
		if (e.key === "ArrowUp" && listLength > 0) {
			e.preventDefault();
			setHighlightIndex((i) => (i <= 0 ? listLength - 1 : i - 1));
			return;
		}
		if (e.key === "Escape") {
			setHighlightIndex(-1);
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			if (showSuggestions && highlightIndex >= 0 && highlightIndex < suggestions.length) {
				onSuggestionClick(suggestions[highlightIndex]);
				setHighlightIndex(-1);
			} else if (query.trim()) {
				onSubmit(query.trim());
			}
		}
	};

	const handleTabClick = (tabId: string) => {
		setActiveTab(tabId);
		onPlayAudio?.();
	};

	return (
		<div className={classes} data-testid="dictionary">
			<div className={styles.searchArea}>
				<input
					ref={inputRef}
					className={styles.searchInput}
					type="text"
					placeholder="Search for a word..."
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					onKeyDown={handleKeyDown}
					aria-label="Search word"
				/>
				{showSuggestions && (
					<ul className={styles.suggestions} role="listbox">
						{suggestions.map((s, i) => (
							<li
								key={s.id}
								className={`${styles.suggestionItem} ${i === highlightIndex ? styles.suggestionHighlighted : ""}`}
								role="option"
								aria-selected={i === highlightIndex}
								onClick={() => {
									onSuggestionClick(s);
									setHighlightIndex(-1);
								}}
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
				{showLookupPrompt && (
					<ul className={styles.suggestions}>
						<li
							className={`${styles.suggestionItem} ${highlightIndex === 0 ? styles.suggestionHighlighted : ""}`}
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
					<>
						<div className={styles.error}>{error}</div>
						{similarWords.length > 0 && (
							<div className={styles.similarWords}>
								<div className={styles.similarWordsLabel}>Similar words:</div>
								<div className={styles.similarWordsList}>
									{similarWords.map((w) => (
										<button
											key={w}
											type="button"
											className={styles.similarWordChip}
											onClick={() => onSubmit(w)}
										>
											{w}
										</button>
									))}
								</div>
							</div>
						)}
					</>
				)}
				{!entry && !loading && !error && (
					<div className={styles.empty}>
						Type a word to look it up.
					</div>
				)}
				{entry && !loading && (
					<>
						<button
							type="button"
							className={styles.addBtn}
							onClick={() => onAdd?.(entry.word)}
							aria-label="Add word"
						>
							<AddIcon width={20} height={20} />
						</button>
						<div className={styles.tabs}>
							{TABS.map((t) => (
								<button
									key={t.id}
									type="button"
									className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
									onClick={() => handleTabClick(t.id)}
								>
									{t.label}
								</button>
							))}
						</div>
						<div className={styles.tabPanel}>
							{activeTab === "english" && (
								<EnglishTab
									entry={entry}
									onPlay={() => onPlayAudio?.()}
								/>
							)}
							{activeTab === "vietnamese" && (
								<VietnameseTab entry={entry} />
							)}
							{activeTab === "examples" && (
								<ExamplesTab entry={entry} />
							)}
							{similarWords.length > 0 && (
								<div className={styles.similarWords}>
									<div className={styles.similarWordsLabel}>Similar words:</div>
									<div className={styles.similarWordsList}>
										{similarWords.map((w) => (
											<button
												key={w}
												type="button"
												className={styles.similarWordChip}
												onClick={() => onSubmit(w)}
											>
												{w}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
});
