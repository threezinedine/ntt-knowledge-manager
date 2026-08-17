import styles from "./stateless-translator.module.scss";

export type TranslationResult = {
	sourceText: string;
	translatedText: string;
	sourceLang: string;
	targetLang: string;
};

type StatelessTranslatorProps = {
	className?: string;
	result: TranslationResult | null;
	loading: boolean;
	error: string | null;
};

export function StatelessTranslator({
	className,
	result,
	loading,
	error,
}: StatelessTranslatorProps) {
	const classes = [styles.content, className].filter(Boolean).join(" ");

	return (
		<div className={classes} data-testid="translator-content">
			{loading && (
				<div className={styles.loading}>Translating...</div>
			)}
			{error && !loading && (
				<div className={styles.error}>{error}</div>
			)}
			{!result && !loading && !error && (
				<div className={styles.empty}>
					Type text to translate.
				</div>
			)}
			{result && !loading && (
				<div className={styles.result}>
					<div className={styles.langLabel}>
						{result.sourceLang}
					</div>
					<div className={styles.sourceText}>{result.sourceText}</div>
					<div className={styles.divider} />
					<div className={styles.langLabel}>
						{result.targetLang}
					</div>
					<div className={styles.translatedText}>{result.translatedText}</div>
				</div>
			)}
		</div>
	);
}
