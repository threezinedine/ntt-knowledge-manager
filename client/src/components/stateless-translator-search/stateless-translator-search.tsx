import { forwardRef, useImperativeHandle, useRef } from "react";
import type { TranslationResult } from "../stateless-translator";
import styles from "./stateless-translator-search.module.scss";

export type StatelessTranslatorSearchHandle = {
	focus: () => void;
};

function SwapIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<path
				d="M4 6H14M14 6L11 3M14 6L11 9M14 12H4M4 12L7 9M4 12L7 15"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

type StatelessTranslatorSearchProps = {
	className?: string;
	query: string;
	sourceLang: string;
	targetLang: string;
	result: TranslationResult | null;
	loading: boolean;
	error: string | null;
	onQueryChange: (query: string) => void;
	onSubmit: (text: string) => void;
	onSwapLanguages?: () => void;
};

export const StatelessTranslatorSearch = forwardRef<StatelessTranslatorSearchHandle, StatelessTranslatorSearchProps>(function StatelessTranslatorSearch({
	className,
	query,
	sourceLang,
	targetLang,
	result,
	loading,
	error,
	onQueryChange,
	onSubmit,
	onSwapLanguages,
}, ref) {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const classes = [styles.translator, className].filter(Boolean).join(" ");

	useImperativeHandle(ref, () => ({
		focus: () => inputRef.current?.focus(),
	}));

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (query.trim()) {
				onSubmit(query.trim());
			}
		}
	};

	const translatedText = result?.translatedText ?? "";

	return (
		<div className={classes} data-testid="translator">
			<div className={styles.langBar}>
				<span className={styles.langLabel}>{sourceLang}</span>
				<button
					type="button"
					className={styles.swapBtn}
					onClick={onSwapLanguages}
					aria-label="Swap languages"
				>
					<SwapIcon />
				</button>
				<span className={styles.langLabel}>{targetLang}</span>
			</div>

			<div className={styles.panels}>
				<div className={styles.panel}>
					<textarea
						ref={inputRef}
						className={styles.textarea}
						placeholder="Enter text to translate..."
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						onKeyDown={handleKeyDown}
						aria-label="Translation input"
					/>
					{query && (
						<button
							type="button"
							className={styles.clearBtn}
							onClick={() => onQueryChange("")}
							aria-label="Clear input"
						>
							&times;
						</button>
					)}
				</div>

				<div className={styles.divider} />

				<div className={styles.panel}>
					{loading && (
						<div className={styles.outputPlaceholder}>Translating...</div>
					)}
					{error && !loading && (
						<div className={styles.outputError}>{error}</div>
					)}
					{!loading && !error && !translatedText && (
						<div className={styles.outputPlaceholder}>Translation</div>
					)}
					{!loading && !error && translatedText && (
						<div className={styles.output} aria-label="Translation output">
							{translatedText}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
