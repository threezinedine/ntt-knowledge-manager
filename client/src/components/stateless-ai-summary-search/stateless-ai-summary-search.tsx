import { forwardRef, useImperativeHandle, useRef } from "react";
import { StatelessAiSummary, type AiSummaryOutput } from "../stateless-ai-summary";
import styles from "./stateless-ai-summary-search.module.scss";

export type StatelessAiSummarySearchHandle = {
	focus: () => void;
};

type StatelessAiSummarySearchProps = {
	className?: string;
	systemPrompt: string;
	userInput: string;
	result: AiSummaryOutput | null;
	loading: boolean;
	error: string | null;
	onSystemPromptChange: (value: string) => void;
	onUserInputChange: (value: string) => void;
	onSubmit: (systemPrompt: string, userInput: string) => void;
};

export const StatelessAiSummarySearch = forwardRef<StatelessAiSummarySearchHandle, StatelessAiSummarySearchProps>(function StatelessAiSummarySearch({
	className,
	systemPrompt,
	userInput,
	result,
	loading,
	error,
	onSystemPromptChange,
	onUserInputChange,
	onSubmit,
}, ref) {
	const userInputRef = useRef<HTMLTextAreaElement>(null);
	const classes = [styles.aiSummary, className].filter(Boolean).join(" ");

	useImperativeHandle(ref, () => ({
		focus: () => userInputRef.current?.focus(),
	}));

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (userInput.trim()) {
				onSubmit(systemPrompt.trim(), userInput.trim());
			}
		}
	};

	return (
		<div className={classes} data-testid="ai-summary">
			<div className={styles.inputArea}>
				<div className={styles.inputGroup}>
					<label className={styles.inputLabel}>System Prompt</label>
					<textarea
						className={styles.systemPromptInput}
						placeholder="Enter system instructions..."
						value={systemPrompt}
						onChange={(e) => onSystemPromptChange(e.target.value)}
						aria-label="System prompt"
						rows={2}
					/>
				</div>
				<div className={styles.inputGroup}>
					<label className={styles.inputLabel}>Input</label>
					<textarea
						ref={userInputRef}
						className={styles.userInput}
						placeholder="Enter text to process..."
						value={userInput}
						onChange={(e) => onUserInputChange(e.target.value)}
						onKeyDown={handleKeyDown}
						aria-label="User input"
						rows={4}
					/>
				</div>
				<button
					type="button"
					className={styles.submitBtn}
					onClick={() => {
						if (userInput.trim()) {
							onSubmit(systemPrompt.trim(), userInput.trim());
						}
					}}
					disabled={!userInput.trim() || loading}
				>
					{loading ? "Processing..." : "Submit"}
				</button>
			</div>

			<StatelessAiSummary
				result={result}
				loading={loading}
				error={error}
			/>
		</div>
	);
});
