import type { TranslatorProvider } from "./translator-provider";
import { MockTranslatorProvider } from "./mock-translator-provider";

export type { TranslateResult, TranslatorProvider } from "./translator-provider";

let activeProvider: TranslatorProvider = new MockTranslatorProvider();

export function setTranslatorProvider(provider: TranslatorProvider): void {
	activeProvider = provider;
}

export function getTranslatorProvider(): TranslatorProvider {
	return activeProvider;
}

export function translate(text: string, sourceLang: string, targetLang: string) {
	return activeProvider.translate(text, sourceLang, targetLang);
}
