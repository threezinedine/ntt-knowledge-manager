import { useCallback, useEffect } from "react";
import { StatelessEpubList, type EpubItem } from "../../../components";
import { useEpubLibraryStore } from "../store/epub-library-store";

type EpubLibraryProps = {
	className?: string;
	onSelect?: (item: EpubItem) => void;
};

export function EpubLibrary({ className, onSelect }: EpubLibraryProps) {
	const { items, downloadedIds, loading, error, load, remove, download } =
		useEpubLibraryStore();

	useEffect(() => {
		load();
	}, [load]);

	const mappedItems: EpubItem[] = items.map((e) => ({
		id: e.id,
		name: e.name,
		originalFilename: e.original_filename,
		fileSize: e.file_size,
		uploadCount: e.upload_count,
		createdAt: e.created_at,
		updatedAt: e.updated_at,
		downloaded: downloadedIds.has(e.id),
	}));

	const handleDelete = useCallback(
		(item: EpubItem) => {
			remove(item.id);
		},
		[remove],
	);

	const handleDownload = useCallback(
		(item: EpubItem) => {
			const epub = items.find((e) => e.id === item.id);
			if (epub) download(epub);
		},
		[items, download],
	);

	return (
		<StatelessEpubList
			className={className}
			items={mappedItems}
			loading={loading}
			error={error}
			onSelect={onSelect}
			onDownload={handleDownload}
			onDelete={handleDelete}
		/>
	);
}
