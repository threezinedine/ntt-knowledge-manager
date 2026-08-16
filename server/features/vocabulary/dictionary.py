from typing import Any

import httpx

API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en"


def _pick_audio(phonetics: list[dict[str, Any]]) -> tuple[str, str]:
    phonetic_text = ""
    audio_url = ""
    for p in phonetics:
        if not phonetic_text and p.get("text"):
            phonetic_text = str(p["text"])
        if not audio_url and p.get("audio"):
            audio_url = str(p["audio"])
        if phonetic_text and audio_url:
            break
    return phonetic_text, audio_url


def _parse_meanings(raw_meanings: list[dict[str, Any]]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for m in raw_meanings:
        part_of_speech: str = str(m.get("partOfSpeech", ""))
        raw_defs: list[dict[str, Any]] = m.get("definitions", [])
        definitions: list[dict[str, str]] = []
        for d in raw_defs:
            entry: dict[str, str] = {"definition": str(d.get("definition", ""))}
            if d.get("example"):
                entry["example"] = str(d["example"])
            definitions.append(entry)
        result.append(
            {
                "partOfSpeech": part_of_speech,
                "definitions": definitions,
            }
        )
    return result


def fetch_word(word: str) -> dict[str, Any] | None:
    try:
        resp = httpx.get(f"{API_URL}/{word}", timeout=10)
        if resp.status_code != 200:
            return None
        entries: list[dict[str, Any]] = resp.json()
        if not entries or not isinstance(entries, list):  # type: ignore
            return None

        entry: dict[str, Any] = entries[0]
        phonetic_text, audio_url = _pick_audio(entry.get("phonetics", []))
        if not phonetic_text:
            phonetic_text = str(entry.get("phonetic", ""))

        meanings = _parse_meanings(entry.get("meanings", []))

        source_url = ""
        for src in entry.get("sourceUrls", []):
            if src:
                source_url = str(src)
                break

        return {
            "phonetic": phonetic_text,
            "audio_url": audio_url,
            "meanings": meanings,
            "oald_link": source_url,
        }
    except httpx.HTTPError:
        return None
