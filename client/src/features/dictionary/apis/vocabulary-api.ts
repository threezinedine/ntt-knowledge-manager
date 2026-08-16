const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

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

function pickAudio(
	phonetics: { text?: string; audio?: string }[],
): { phonetic: string; audio_url: string } {
	let phonetic = "";
	let audio_url = "";
	for (const p of phonetics) {
		if (!phonetic && p.text) phonetic = p.text;
		if (!audio_url && p.audio) audio_url = p.audio;
		if (phonetic && audio_url) break;
	}
	return { phonetic, audio_url };
}

function parseMeanings(
	raw: { partOfSpeech?: string; definitions?: { definition?: string; example?: string }[] }[],
): MeaningItem[] {
	return raw.map((m) => ({
		partOfSpeech: m.partOfSpeech ?? "",
		definitions: (m.definitions ?? []).map((d) => ({
			definition: d.definition ?? "",
			example: d.example ?? "",
		})),
	}));
}

export async function lookupWord(word: string): Promise<DictionaryResult> {
	const res = await fetch(`${DICTIONARY_API}/${encodeURIComponent(word)}`);
	if (!res.ok) throw new Error(`Word not found: ${word}`);

	const entries = await res.json();
	if (!Array.isArray(entries) || entries.length === 0) {
		throw new Error(`No entries for: ${word}`);
	}

	const entry = entries[0];
	const { phonetic, audio_url } = pickAudio(entry.phonetics ?? []);

	return {
		word: entry.word ?? word,
		phonetic: phonetic || entry.phonetic || "",
		audio_url,
		meanings: parseMeanings(entry.meanings ?? []),
		source_url: (entry.sourceUrls ?? [])[0] ?? "",
	};
}
