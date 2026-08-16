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
		const results: DictionaryResult[] = [];

		for (const provider of this.providers) {
			try {
				const result = await provider.lookupWord(word);
				if (result.audio_url && result.phonetic && result.meanings.length > 0) {
					return result;
				}
				results.push(result);
			} catch (e) {
				lastError = e as Error;
			}
		}

		if (results.length === 0) {
			throw lastError ?? new Error(`Word not found: ${word}`);
		}

		const best = results.reduce((a, b) =>
			b.meanings.length > a.meanings.length ? b : a,
		);

		if (!best.phonetic) {
			best.phonetic = results.find((r) => r.phonetic)?.phonetic ?? "";
		}
		if (!best.audio_url) {
			best.audio_url = results.find((r) => r.audio_url)?.audio_url ?? "";
		}

		return best;
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
