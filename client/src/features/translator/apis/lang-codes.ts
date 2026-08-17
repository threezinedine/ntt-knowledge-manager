const LANG_MAP: Record<string, string> = {
	english: "en",
	vietnamese: "vi",
	japanese: "ja",
	korean: "ko",
	chinese: "zh",
	french: "fr",
	german: "de",
	spanish: "es",
	italian: "it",
	portuguese: "pt",
	russian: "ru",
	thai: "th",
	indonesian: "id",
	dutch: "nl",
	arabic: "ar",
	hindi: "hi",
	turkish: "tr",
	polish: "pl",
	swedish: "sv",
	czech: "cs",
};

export function toLangCode(lang: string): string {
	const code = LANG_MAP[lang.toLowerCase()];
	if (code) return code;
	if (lang.length <= 5) return lang.toLowerCase();
	return lang.toLowerCase().slice(0, 2);
}
