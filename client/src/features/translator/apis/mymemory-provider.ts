import type { TranslatorProvider, TranslateResult } from "./translator-provider";
import { toLangCode } from "./lang-codes";

const MYMEMORY_API = "https://api.mymemory.translated.net/get";

export class MyMemoryProvider implements TranslatorProvider {
	name = "MyMemory";

	async translate(text: string, sourceLang: string, targetLang: string): Promise<TranslateResult> {
		const src = toLangCode(sourceLang);
		const tgt = toLangCode(targetLang);

		const params = new URLSearchParams({
			q: text,
			langpair: `${src}|${tgt}`,
		});

		const res = await fetch(`${MYMEMORY_API}?${params}`);
		if (!res.ok) throw new Error("MyMemory request failed");

		const data = await res.json();
		const translated = data?.responseData?.translatedText;

		if (!translated || data?.responseStatus === 403) {
			throw new Error("MyMemory translation failed");
		}

		return {
			sourceText: text,
			translatedText: translated,
			sourceLang,
			targetLang,
		};
	}
}
