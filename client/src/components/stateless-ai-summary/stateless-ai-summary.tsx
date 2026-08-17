import styles from "./stateless-ai-summary.module.scss";

export type AiSummaryOutput = {
	systemPrompt: string;
	userInput: string;
	output: string;
};

type StatelessAiSummaryProps = {
	className?: string;
	result: AiSummaryOutput | null;
	loading: boolean;
	error: string | null;
};

export function StatelessAiSummary({
	className,
	result,
	loading,
	error,
}: StatelessAiSummaryProps) {
	const classes = [styles.content, className].filter(Boolean).join(" ");

	return (
		<div className={classes} data-testid="ai-summary-content">
			{loading && (
				<div className={styles.loading}>Processing...</div>
			)}
			{error && !loading && (
				<div className={styles.error}>{error}</div>
			)}
			{!result && !loading && !error && (
				<div className={styles.empty}>
					Enter a prompt and input to get a response.
				</div>
			)}
			{result && !loading && (
				<div className={styles.result}>
					<div className={styles.output}>{result.output}</div>
				</div>
			)}
		</div>
	);
}
