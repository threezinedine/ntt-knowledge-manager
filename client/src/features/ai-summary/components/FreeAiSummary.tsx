import { useCallback, useEffect, useRef, useState } from "react";
import { StatelessAiSummary, type AiChatMessage, type FollowUpButton } from "../../../components";
import { summarize, chatComplete, type AiSummaryResult, type ChatMessage } from "../apis/ai-summary-api";

const DEFAULT_FOLLOW_UPS: FollowUpButton[] = [
	{ label: "Explain more", prompt: "Can you explain that in more detail?" },
	{ label: "Give examples", prompt: "Can you give me some concrete examples?" },
	{ label: "Simplify", prompt: "Can you simplify that even further? Keep it super short." },
	{ label: "Translate to Vietnamese", prompt: "Translate your previous response to Vietnamese." },
];

type FreeAiSummaryProps = {
	systemPrompt: string;
	userInput: string;
	followUpButtons?: FollowUpButton[];
	className?: string;
};

export function FreeAiSummary({
	systemPrompt,
	userInput,
	followUpButtons = DEFAULT_FOLLOW_UPS,
	className,
}: FreeAiSummaryProps) {
	const [result, setResult] = useState<AiSummaryResult | null>(null);
	const [messages, setMessages] = useState<AiChatMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const historyRef = useRef<ChatMessage[]>([]);

	const handleSummarize = useCallback(
		(sp: string, ui: string) => {
			const trimmedInput = ui.trim();
			if (!trimmedInput) return;

			setLoading(true);
			setError(null);
			setMessages([]);
			historyRef.current = [];

			summarize(sp.trim(), trimmedInput)
				.then((r) => {
					setResult(r);
					setLoading(false);
					historyRef.current = [
						{ role: "system", content: sp.trim() },
						{ role: "user", content: trimmedInput },
						{ role: "assistant", content: r.output },
					];
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

	const handleFollowUp = useCallback((prompt: string) => {
		setLoading(true);
		setError(null);

		const userMsg: AiChatMessage = { role: "user", content: prompt };
		setMessages((prev) => [...prev, userMsg]);

		const fullPrompt = `${prompt} Format your output in markdown. Do not include any thinking process, internal reasoning, or <think> tags — only output the final result.`;

		historyRef.current = [
			...historyRef.current,
			{ role: "user", content: fullPrompt },
		];

		chatComplete(historyRef.current)
			.then((output) => {
				const assistantMsg: AiChatMessage = { role: "assistant", content: output };
				setMessages((prev) => [...prev, assistantMsg]);
				historyRef.current = [
					...historyRef.current,
					{ role: "assistant", content: output },
				];
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
				setError("Failed to get follow-up response");
			});
	}, []);

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
			messages={messages}
			loading={loading}
			error={error}
			followUpButtons={followUpButtons}
			onFollowUp={handleFollowUp}
		/>
	);
}
