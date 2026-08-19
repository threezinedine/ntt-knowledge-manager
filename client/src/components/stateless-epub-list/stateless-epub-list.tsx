import { CloseIcon, DownloadIcon } from "../../icons";
import styles from "./stateless-epub-list.module.scss";

export type EpubItem = {
	id: number;
	name: string;
	originalFilename: string;
	fileSize: number;
	uploadCount: number;
	createdAt: string;
	updatedAt: string;
	downloaded?: boolean;
};

type StatelessEpubListProps = {
	items: EpubItem[];
	loading: boolean;
	error: string | null;
	className?: string;
	onSelect?: (item: EpubItem) => void;
	onDownload?: (item: EpubItem) => void;
	onDelete?: (item: EpubItem) => void;
};

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function StatelessEpubList({
	items,
	loading,
	error,
	className,
	onSelect,
	onDownload,
	onDelete,
}: StatelessEpubListProps) {
	const classes = [styles.container, className].filter(Boolean).join(" ");

	return (
		<div className={classes} data-testid="epub-list">
			{loading && items.length === 0 && (
				<div className={styles.empty}>Loading...</div>
			)}

			{error && (
				<div className={styles.error}>{error}</div>
			)}

			{!loading && !error && items.length === 0 && (
				<div className={styles.empty}>No epubs uploaded yet.</div>
			)}

			{items.length > 0 && (
				<ul className={styles.list}>
					{items.map((item) => (
						<li key={item.id} className={styles.item}>
							<button
								type="button"
								className={styles.itemBody}
								onClick={() => onSelect?.(item)}
							>
								<div className={styles.bookIcon}>📖</div>
								<div className={styles.info}>
									<span className={styles.name}>{item.name}</span>
									<span className={styles.meta}>
										{formatFileSize(item.fileSize)} · {formatDate(item.createdAt)}
									</span>
								</div>
							</button>
							<div className={styles.actions}>
								{!item.downloaded && onDownload && (
									<button
										type="button"
										className={styles.actionBtn}
										onClick={(e) => {
											e.stopPropagation();
											onDownload(item);
										}}
										aria-label={`Download ${item.name}`}
									>
										<DownloadIcon width={16} height={16} />
									</button>
								)}
								{onDelete && (
									<button
										type="button"
										className={styles.actionBtn}
										data-danger
										onClick={(e) => {
											e.stopPropagation();
											onDelete(item);
										}}
										aria-label={`Delete ${item.name}`}
									>
										<CloseIcon width={16} height={16} />
									</button>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
