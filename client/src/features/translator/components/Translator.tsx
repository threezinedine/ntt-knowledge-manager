import { useCallback } from "react";
import { StatelessTranslatorSearch } from "../../../components";
import { useTranslatorStore } from "../store/translator-store";

type TranslatorProps = {
	className?: string;
};

export function Translator({ className }: TranslatorProps) {
	const { query, result, loading, error, sourceLang, targetLang, setQuery, submit, swapLanguages } =
		useTranslatorStore();

	const handleSubmit = useCallback(
		(text: string) => {
			submit(text);
		},
		[submit],
	);

	const mappedResult = result
		? {
				sourceText: result.sourceText,
				translatedText: result.translatedText,
				sourceLang: result.sourceLang,
				targetLang: result.targetLang,
			}
		: null;

	return (
		<StatelessTranslatorSearch
			className={className}
			query={query}
			sourceLang={sourceLang}
			targetLang={targetLang}
			result={mappedResult}
			loading={loading}
			error={error}
			onQueryChange={setQuery}
			onSubmit={handleSubmit}
			onSwapLanguages={swapLanguages}
		/>
	);
}
