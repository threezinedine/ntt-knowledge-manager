import type { DictionaryProvider, DictionaryResult, SuggestionItem } from "./dictionary-provider";

export class FallbackProvider implements DictionaryProvider {
	name: string;
	private providers: DictionaryProvider[];

	constructor(providers: DictionaryProvider[]) {
		this.providers = providers;
		this.name = providers.map((p) => p.name).join(" + ");
	}

	async lookupWord(word: string): Promise<DictionaryResult> {
		let lastError: Error | null = null;
		let partialResult: DictionaryResult | null = null;

		for (const provider of this.providers) {
			try {
				const result = await provider.lookupWord(word);
				if (result.audio_url && result.meanings.length > 0) {
					return result;
				}
				if (!partialResult || result.meanings.length > partialResult.meanings.length) {
					partialResult = result;
				}
			} catch (e) {
				lastError = e as Error;
			}
		}

		if (partialResult) {
			if (!partialResult.audio_url) {
				for (const provider of this.providers) {
					try {
						const fallback = await provider.lookupWord(word);
						if (fallback.audio_url) {
							partialResult.audio_url = fallback.audio_url;
							break;
						}
					} catch { /* skip */ }
				}
			}
			return partialResult;
		}

		throw lastError ?? new Error(`Word not found: ${word}`);
	}

	async getSuggestions(prefix: string): Promise<SuggestionItem[]> {
		for (const provider of this.providers) {
			try {
				const results = await provider.getSuggestions(prefix);
				if (results.length > 0) return results;
			} catch { /* skip */ }
		}
		return [];
	}

	async getSimilarWords(word: string): Promise<string[]> {
		for (const provider of this.providers) {
			try {
				const results = await provider.getSimilarWords(word);
				if (results.length > 0) return results;
			} catch { /* skip */ }
		}
		return [];
	}
}
