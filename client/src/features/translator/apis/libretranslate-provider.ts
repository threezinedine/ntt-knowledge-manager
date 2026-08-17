import type { TranslatorProvider, TranslateResult } from "./translator-provider";
import { toLangCode } from "./lang-codes";

const LIBRETRANSLATE_API = "https://libretranslate.com/translate";

export class LibreTranslateProvider implements TranslatorProvider {
	name = "LibreTranslate";

	private apiUrl: string;

	constructor(apiUrl: string = LIBRETRANSLATE_API) {
		this.apiUrl = apiUrl;
	}

	async translate(text: string, sourceLang: string, targetLang: string): Promise<TranslateResult> {
		const src = toLangCode(sourceLang);
		const tgt = toLangCode(targetLang);

		const res = await fetch(this.apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				q: text,
				source: src,
				target: tgt,
				format: "text",
			}),
		});

		if (!res.ok) throw new Error("LibreTranslate request failed");

		const data = await res.json();
		const translated = data?.translatedText;

		if (!translated) {
			throw new Error("LibreTranslate translation failed");
		}

		return {
			sourceText: text,
			translatedText: translated,
			sourceLang,
			targetLang,
		};
	}
}
