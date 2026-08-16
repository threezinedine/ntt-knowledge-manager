import type { DictionaryProvider } from "./dictionary-provider";
import { FallbackProvider } from "./fallback-provider";
import { FreeDictionaryProvider } from "./free-dictionary-provider";
import { WiktionaryProvider } from "./wiktionary-provider";

export type { DictionaryResult, MeaningItem, DefinitionItem, DictionaryProvider, SuggestionItem } from "./dictionary-provider";

let activeProvider: DictionaryProvider = new FallbackProvider([
	new FreeDictionaryProvider(),
	new WiktionaryProvider(),
]);

export function setDictionaryProvider(provider: DictionaryProvider): void {
	activeProvider = provider;
}

export function getDictionaryProvider(): DictionaryProvider {
	return activeProvider;
}

export function lookupWord(word: string) {
	return activeProvider.lookupWord(word);
}

export function getSimilarWords(word: string) {
	return activeProvider.getSimilarWords(word);
}

export function getSuggestions(prefix: string) {
	return activeProvider.getSuggestions(prefix);
}
