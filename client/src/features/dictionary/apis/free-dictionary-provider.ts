import type { DictionaryProvider, DictionaryResult, MeaningItem, SuggestionItem } from "./dictionary-provider";

const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";
const WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php";
const DATAMUSE_API = "https://api.datamuse.com/words";
const DATAMUSE_SUG_API = "https://api.datamuse.com/sug";

type PhoneticEntry = {
	text?: string;
	audio?: string;
	sourceUrl?: string;
};

function isUsAudio(entry: PhoneticEntry): boolean {
	return (entry.audio ?? "").includes("-us");
}

function pickPhonetic(phonetics: PhoneticEntry[]): {
	phonetic: string;
	sourceUrl: string;
} {
	let phonetic = "";
	let sourceUrl = "";
	const usEntry = phonetics.find((p) => isUsAudio(p) && p.sourceUrl);
	if (usEntry) {
		sourceUrl = usEntry.sourceUrl!;
		if (usEntry.text) phonetic = usEntry.text;
	}
	if (!sourceUrl) {
		for (const p of phonetics) {
			if (!sourceUrl && p.sourceUrl && p.audio) sourceUrl = p.sourceUrl;
		}
	}
	if (!phonetic) {
		for (const p of phonetics) {
			if (p.text) { phonetic = p.text; break; }
		}
	}
	return { phonetic, sourceUrl };
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

async function resolveAudioUrl(sourceUrl: string): Promise<string> {
	const match = /[?&]curid=(\d+)/.exec(sourceUrl);
	if (!match) return "";

	const params = new URLSearchParams({
		action: "query",
		pageids: match[1],
		prop: "imageinfo",
		iiprop: "url",
		format: "json",
		origin: "*",
	});

	try {
		const res = await fetch(`${WIKIMEDIA_API}?${params}`);
		if (!res.ok) return "";
		const data = await res.json();
		const pages = data?.query?.pages;
		if (!pages) return "";
		const page = pages[match[1]];
		const url: string = page?.imageinfo?.[0]?.url ?? "";
		return url.split("?")[0];
	} catch {
		return "";
	}
}

export class FreeDictionaryProvider implements DictionaryProvider {
	name = "Free Dictionary";

	async lookupWord(word: string): Promise<DictionaryResult> {
		const res = await fetch(`${DICTIONARY_API}/${encodeURIComponent(word)}`);
		if (!res.ok) throw new Error(`Word not found: ${word}`);

		const entries = await res.json();
		if (!Array.isArray(entries) || entries.length === 0) {
			throw new Error(`No entries for: ${word}`);
		}

		const entry = entries[0];
		const { phonetic, sourceUrl } = pickPhonetic(entry.phonetics ?? []);

		let audio_url = "";
		if (sourceUrl) {
			audio_url = await resolveAudioUrl(sourceUrl);
		}

		return {
			word: entry.word ?? word,
			phonetic: phonetic || entry.phonetic || "",
			audio_url,
			meanings: parseMeanings(entry.meanings ?? []),
			source_url: (entry.sourceUrls ?? [])[0] ?? "",
		};
	}

	async getSuggestions(prefix: string): Promise<SuggestionItem[]> {
		if (prefix.length < 2) return [];
		const params = new URLSearchParams({ s: prefix, max: "8" });
		try {
			const res = await fetch(`${DATAMUSE_SUG_API}?${params}`);
			if (!res.ok) return [];
			const data: { word: string; score: number }[] = await res.json();
			return data.map((d) => ({ word: d.word, score: d.score }));
		} catch {
			return [];
		}
	}

	async getSimilarWords(word: string): Promise<string[]> {
		const params = new URLSearchParams({ sl: word, max: "10" });
		try {
			const res = await fetch(`${DATAMUSE_API}?${params}`);
			if (!res.ok) return [];
			const data: { word: string }[] = await res.json();
			return data
				.map((d) => d.word)
				.filter((w) => w.toLowerCase() !== word.toLowerCase());
		} catch {
			return [];
		}
	}
}
