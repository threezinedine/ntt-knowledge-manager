const MYMEMORY_API = "https://api.mymemory.translated.net/get";

export async function translateToVietnamese(text: string): Promise<string> {
	const params = new URLSearchParams({
		q: text,
		langpair: "en|vi",
	});
	try {
		const res = await fetch(`${MYMEMORY_API}?${params}`);
		if (!res.ok) return "";
		const data = await res.json();
		return data?.responseData?.translatedText ?? "";
	} catch {
		return "";
	}
}
