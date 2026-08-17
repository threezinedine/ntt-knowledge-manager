export { Dictionary, FreeDictionary } from "./components";
export { useDictionaryStore } from "./store/dictionary-store";
export { setDictionaryProvider, getDictionaryProvider } from "./apis/vocabulary-api";
export type { DictionaryProvider, DictionaryResult, SuggestionItem } from "./apis/vocabulary-api";
export { FreeDictionaryProvider } from "./apis/free-dictionary-provider";
export { WiktionaryProvider } from "./apis/wiktionary-provider";
export { FallbackProvider } from "./apis/fallback-provider";
