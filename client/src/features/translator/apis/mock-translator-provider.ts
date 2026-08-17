import type { TranslatorProvider, TranslateResult } from "./translator-provider";

export class MockTranslatorProvider implements TranslatorProvider {
	name = "Mock Translator";

	async translate(text: string, sourceLang: string, targetLang: string): Promise<TranslateResult> {
		await new Promise((resolve) => setTimeout(resolve, 500));

		return {
			sourceText: text,
			translatedText: `[${targetLang}] ${text}`,
			sourceLang,
			targetLang,
		};
	}
}
