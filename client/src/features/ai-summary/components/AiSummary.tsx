import { useCallback } from "react";
import { StatelessAiSummarySearch } from "../../../components";
import { useAiSummaryStore } from "../store/ai-summary-store";

type AiSummaryProps = {
	className?: string;
};

export function AiSummary({ className }: AiSummaryProps) {
	const { systemPrompt, userInput, result, loading, error, setSystemPrompt, setUserInput, submit } =
		useAiSummaryStore();

	const handleSubmit = useCallback(
		(sp: string, ui: string) => {
			submit(sp, ui);
		},
		[submit],
	);

	const mappedResult = result
		? {
				systemPrompt: result.systemPrompt,
				userInput: result.userInput,
				output: result.output,
			}
		: null;

	return (
		<StatelessAiSummarySearch
			className={className}
			systemPrompt={systemPrompt}
			userInput={userInput}
			result={mappedResult}
			loading={loading}
			error={error}
			onSystemPromptChange={setSystemPrompt}
			onUserInputChange={setUserInput}
			onSubmit={handleSubmit}
		/>
	);
}
