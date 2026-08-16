export type DefinitionItem = {
	definition: string;
	example: string;
};

export type MeaningItem = {
	partOfSpeech: string;
	definitions: DefinitionItem[];
};

export type DictionaryResult = {
	word: string;
	phonetic: string;
	audio_url: string;
	meanings: MeaningItem[];
	source_url: string;
};

export type SuggestionItem = {
	word: string;
	score: number;
};

export interface DictionaryProvider {
	name: string;
	lookupWord(word: string): Promise<DictionaryResult>;
	getSimilarWords(word: string): Promise<string[]>;
	getSuggestions(prefix: string): Promise<SuggestionItem[]>;
}
