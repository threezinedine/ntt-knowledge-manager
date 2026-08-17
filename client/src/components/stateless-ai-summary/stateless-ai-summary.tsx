import { useMemo, useRef, useEffect } from "react";
import { marked } from "marked";
import styles from "./stateless-ai-summary.module.scss";

export type AiSummaryOutput = {
	systemPrompt: string;
	userInput: string;
	output: string;
};

export type AiChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export type FollowUpButton = {
	label: string;
	prompt: string;
};

type StatelessAiSummaryProps = {
	className?: string;
	result: AiSummaryOutput | null;
	messages?: AiChatMessage[];
	loading: boolean;
	error: string | null;
	followUpButtons?: FollowUpButton[];
	onFollowUp?: (prompt: string) => void;
};

function renderMarkdown(text: string): string {
	return marked.parse(text, { async: false }) as string;
}

export function StatelessAiSummary({
	className,
	result,
	messages = [],
	loading,
	error,
	followUpButtons = [],
	onFollowUp,
}: StatelessAiSummaryProps) {
	const classes = [styles.content, className].filter(Boolean).join(" ");
	const bottomRef = useRef<HTMLDivElement>(null);

	const hasMessages = messages.length > 0;
	const hasResult = result !== null;

	useEffect(() => {
		bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
	}, [messages.length, loading]);

	const initialHtml = useMemo(() => {
		if (!result?.output) return "";
		return renderMarkdown(result.output);
	}, [result?.output]);

	const messageHtmls = useMemo(
		() => messages.map((m) => renderMarkdown(m.content)),
		[messages],
	);

	const showButtons = !loading && (hasResult || hasMessages) && followUpButtons.length > 0;

	return (
		<div className={classes} data-testid="ai-summary-content">
			{!hasResult && !hasMessages && !loading && !error && (
				<div className={styles.empty}>
					Enter a prompt and input to get a response.
				</div>
			)}
			{error && !loading && !hasResult && !hasMessages && (
				<div className={styles.error}>{error}</div>
			)}

			{(hasResult || hasMessages) && (
				<div className={styles.chatArea}>
					{hasResult && (
						<div className={styles.assistantBubble}>
							<div
								className={styles.output}
								dangerouslySetInnerHTML={{ __html: initialHtml }}
							/>
						</div>
					)}

					{messages.map((msg, i) => (
						<div
							key={i}
							className={
								msg.role === "user"
									? styles.userBubble
									: styles.assistantBubble
							}
						>
							{msg.role === "user" ? (
								<div className={styles.userText}>{msg.content}</div>
							) : (
								<div
									className={styles.output}
									dangerouslySetInnerHTML={{ __html: messageHtmls[i] }}
								/>
							)}
						</div>
					))}

					{loading && (
						<div className={styles.assistantBubble}>
							<div className={styles.thinking}>Thinking...</div>
						</div>
					)}

					{error && (hasResult || hasMessages) && !loading && (
						<div className={styles.assistantBubble}>
							<div className={styles.inlineError}>{error}</div>
						</div>
					)}

					{showButtons && (
						<div className={styles.followUpBar}>
							{followUpButtons.map((btn) => (
								<button
									key={btn.label}
									type="button"
									className={styles.followUpBtn}
									onClick={() => onFollowUp?.(btn.prompt)}
								>
									{btn.label}
								</button>
							))}
						</div>
					)}

					<div ref={bottomRef} />
				</div>
			)}

			{loading && !hasResult && !hasMessages && (
				<div className={styles.loading}>Processing...</div>
			)}
		</div>
	);
}
