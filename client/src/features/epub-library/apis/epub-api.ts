import { getStoredToken } from "../../auth";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export type EpubData = {
	id: number;
	name: string;
	original_filename: string;
	url: string;
	file_size: number;
	upload_count: number;
	created_at: string;
	updated_at: string;
};

export type EpubPage = {
	items: EpubData[];
	total: number;
	limit: number;
	offset: number;
};

function authHeaders(): HeadersInit {
	return {
		Authorization: `Bearer ${getStoredToken()}`,
	};
}

function authJsonHeaders(): HeadersInit {
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getStoredToken()}`,
	};
}

export async function fetchEpubs(
	params: { q?: string; sort?: string; limit?: number; offset?: number } = {},
): Promise<EpubPage> {
	const query = new URLSearchParams();
	if (params.q) query.set("q", params.q);
	if (params.sort) query.set("sort", params.sort);
	if (params.limit) query.set("limit", String(params.limit));
	if (params.offset) query.set("offset", String(params.offset));

	const qs = query.toString();
	const res = await fetch(`${API_BASE_URL}/epubs${qs ? `?${qs}` : ""}`, {
		headers: authHeaders(),
	});
	if (!res.ok) throw new Error("Failed to fetch epubs");
	return res.json();
}

export async function uploadEpub(file: File): Promise<EpubData> {
	const form = new FormData();
	form.append("file", file);

	const res = await fetch(`${API_BASE_URL}/epubs`, {
		method: "POST",
		headers: authHeaders(),
		body: form,
	});
	if (!res.ok) throw new Error("Failed to upload epub");
	return res.json();
}

export async function deleteEpub(id: number): Promise<void> {
	const res = await fetch(`${API_BASE_URL}/epubs/${id}`, {
		method: "DELETE",
		headers: authHeaders(),
	});
	if (!res.ok) throw new Error("Failed to delete epub");
}

export async function updateEpub(
	id: number,
	data: { name?: string },
): Promise<EpubData> {
	const res = await fetch(`${API_BASE_URL}/epubs/${id}`, {
		method: "PATCH",
		headers: authJsonHeaders(),
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update epub");
	return res.json();
}

export function getDownloadUrl(epub: EpubData): string {
	return `${API_BASE_URL}${epub.url}`;
}
