import { useCallback, useEffect, useState } from "react";
import { StatelessAiSummary } from "../../../components";
import { summarize, type AiSummaryResult } from "../apis/ai-summary-api";

type FreeAiSummaryProps = {
	systemPrompt: string;
	userInput: string;
	className?: string;
};

export function FreeAiSummary({ systemPrompt, userInput, className }: FreeAiSummaryProps) {
	const [result, setResult] = useState<AiSummaryResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSummarize = useCallback(
		(sp: string, ui: string) => {
			const trimmedInput = ui.trim();
			if (!trimmedInput) return;

			setLoading(true);
			setError(null);

			summarize(sp.trim(), trimmedInput)
				.then((r) => {
					setResult(r);
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
					setError("Failed to process request");
					setResult(null);
				});
		},
		[],
	);

	useEffect(() => {
		if (userInput.trim()) {
			handleSummarize(systemPrompt, userInput);
		}
	}, [systemPrompt, userInput, handleSummarize]);

	const mappedResult = result
		? {
				systemPrompt: result.systemPrompt,
				userInput: result.userInput,
				output: result.output,
			}
		: null;

	return (
		<StatelessAiSummary
			className={className}
			result={mappedResult}
			loading={loading}
			error={error}
		/>
	);
}
