import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StatelessDictionary, type DictionaryEntry } from "../stateless-dictionary";
import styles from "./stateless-dictionary-search.module.scss";

export type DictionarySuggestion = {
	id: number;
	word: string;
	phonetic: string;
};

export type StatelessDictionarySearchHandle = {
	focus: () => void;
	triggerAdd: () => void;
};

type StatelessDictionarySearchProps = {
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

export const StatelessDictionarySearch = forwardRef<StatelessDictionarySearchHandle, StatelessDictionarySearchProps>(function StatelessDictionarySearch({
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

			<StatelessDictionary
				entry={entry}
				loading={loading}
				error={error}
				similarWords={similarWords}
				onSubmit={onSubmit}
				onPlayAudio={onPlayAudio}
				onAdd={onAdd}
			/>
		</div>
	);
});
