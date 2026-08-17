export type TranslateResult = {
	sourceText: string;
	translatedText: string;
	sourceLang: string;
	targetLang: string;
};

export interface TranslatorProvider {
	name: string;
	translate(text: string, sourceLang: string, targetLang: string): Promise<TranslateResult>;
}
