import type { TranslatorProvider, TranslateResult } from "./translator-provider";

export class FallbackTranslatorProvider implements TranslatorProvider {
	name = "Fallback";
	private providers: TranslatorProvider[];

	constructor(providers: TranslatorProvider[]) {
		this.providers = providers;
		if (providers.length > 0) {
			this.name = providers.map((p) => p.name).join(" / ");
		}
	}

	async translate(text: string, sourceLang: string, targetLang: string): Promise<TranslateResult> {
		let lastError: Error | null = null;

		for (const provider of this.providers) {
			try {
				return await provider.translate(text, sourceLang, targetLang);
			} catch (err) {
				lastError = err instanceof Error ? err : new Error(String(err));
			}
		}

		throw lastError ?? new Error("No translation providers available");
	}
}
