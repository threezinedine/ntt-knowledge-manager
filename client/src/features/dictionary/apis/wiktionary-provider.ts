import type { DictionaryProvider, DictionaryResult, MeaningItem, SuggestionItem } from "./dictionary-provider";

const WIKTIONARY_API = "https://en.wiktionary.org/api/rest_v1/page/definition";
const WIKTIONARY_MEDIA_API = "https://commons.wikimedia.org/w/api.php";

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.trim();
}

function parseMeanings(
	data: Record<string, { partOfSpeech: string; definitions: { definition: string; examples?: string[] }[] }[]>,
): MeaningItem[] {
	const english = data["en"];
	if (!english) return [];
	return english.map((section) => ({
		partOfSpeech: section.partOfSpeech ?? "",
		definitions: (section.definitions ?? []).map((d) => ({
			definition: stripHtml(d.definition ?? ""),
			example: d.examples?.[0] ? stripHtml(d.examples[0]) : "",
		})),
	}));
}

async function findAudioUrl(word: string): Promise<string> {
	const variants = [
		`File:En-us-${word}.ogg`,
		`File:En-${word}.ogg`,
		`File:En-us-${word}.flac`,
		`File:En-us-${word}.mp3`,
	];

	const titles = variants.join("|");
	const params = new URLSearchParams({
		action: "query",
		titles,
		prop: "imageinfo",
		iiprop: "url",
		format: "json",
		origin: "*",
	});

	try {
		const res = await fetch(`${WIKTIONARY_MEDIA_API}?${params}`);
		if (!res.ok) return "";
		const data = await res.json();
		const pages = data?.query?.pages;
		if (!pages) return "";
		for (const id of Object.keys(pages)) {
			if (id === "-1") continue;
			const url: string = pages[id]?.imageinfo?.[0]?.url ?? "";
			if (url) return url.split("?")[0];
		}
		return "";
	} catch {
		return "";
	}
}

export class WiktionaryProvider implements DictionaryProvider {
	name = "Wiktionary";

	async lookupWord(word: string): Promise<DictionaryResult> {
		const res = await fetch(`${WIKTIONARY_API}/${encodeURIComponent(word.toLowerCase())}`);
		if (!res.ok) throw new Error(`Word not found: ${word}`);

		const data = await res.json();
		const meanings = parseMeanings(data);
		if (meanings.length === 0) {
			throw new Error(`No English definitions for: ${word}`);
		}

		const audio_url = await findAudioUrl(word.toLowerCase());

		return {
			word: word.toLowerCase(),
			phonetic: "",
			audio_url,
			meanings,
			source_url: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
		};
	}

	async getSuggestions(prefix: string): Promise<SuggestionItem[]> {
		if (prefix.length < 2) return [];
		const params = new URLSearchParams({
			action: "opensearch",
			search: prefix,
			limit: "8",
			namespace: "0",
			format: "json",
			origin: "*",
		});
		try {
			const res = await fetch(`https://en.wiktionary.org/w/api.php?${params}`);
			if (!res.ok) return [];
			const data = await res.json();
			const words: string[] = data[1] ?? [];
			return words.map((w, i) => ({ word: w, score: 1000 - i }));
		} catch {
			return [];
		}
	}

	async getSimilarWords(word: string): Promise<string[]> {
		const params = new URLSearchParams({
			action: "opensearch",
			search: word,
			limit: "10",
			namespace: "0",
			format: "json",
			origin: "*",
		});
		try {
			const res = await fetch(`https://en.wiktionary.org/w/api.php?${params}`);
			if (!res.ok) return [];
			const data = await res.json();
			const words: string[] = data[1] ?? [];
			return words.filter((w) => w.toLowerCase() !== word.toLowerCase());
		} catch {
			return [];
		}
	}
}
