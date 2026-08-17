import { useCallback, useEffect, useState } from "react";
import { StatelessTranslator } from "../../../components";
import { translate, type TranslateResult } from "../apis/translator-api";

type FreeTranslatorProps = {
	text: string;
	sourceLang?: string;
	targetLang?: string;
	className?: string;
};

export function FreeTranslator({
	text,
	sourceLang = "English",
	targetLang = "Vietnamese",
	className,
}: FreeTranslatorProps) {
	const [result, setResult] = useState<TranslateResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleTranslate = useCallback(
		(t: string) => {
			const trimmed = t.trim();
			if (!trimmed) return;

			setLoading(true);
			setError(null);

			translate(trimmed, sourceLang, targetLang)
				.then((r) => {
					setResult(r);
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
					setError(`Translation failed for "${trimmed}"`);
					setResult(null);
				});
		},
		[sourceLang, targetLang],
	);

	useEffect(() => {
		if (text.trim()) {
			handleTranslate(text);
		}
	}, [text, handleTranslate]);

	const mappedResult = result
		? {
				sourceText: result.sourceText,
				translatedText: result.translatedText,
				sourceLang: result.sourceLang,
				targetLang: result.targetLang,
			}
		: null;

	return (
		<StatelessTranslator
			className={className}
			result={mappedResult}
			loading={loading}
			error={error}
		/>
	);
}
