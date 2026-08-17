import type { TranslatorProvider } from "./translator-provider";
import { MyMemoryProvider } from "./mymemory-provider";
import { LibreTranslateProvider } from "./libretranslate-provider";
import { FallbackTranslatorProvider } from "./fallback-provider";

export type { TranslateResult, TranslatorProvider } from "./translator-provider";

let activeProvider: TranslatorProvider = new FallbackTranslatorProvider([
	new MyMemoryProvider(),
	new LibreTranslateProvider(),
]);

export function setTranslatorProvider(provider: TranslatorProvider): void {
	activeProvider = provider;
}

export function getTranslatorProvider(): TranslatorProvider {
	return activeProvider;
}

export function translate(text: string, sourceLang: string, targetLang: string) {
	return activeProvider.translate(text, sourceLang, targetLang);
}
