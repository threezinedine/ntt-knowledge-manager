import { useCallback, useEffect, useRef } from "react";
import { EpubReader, type EpubPage, type EpubReaderConfig } from "../../../components";
import { FreeDictionary } from "../../dictionary";
import { useEpubStore } from "../store/epub-store";
import styles from "./epub.module.scss";

type EpubProps = {
	pages: EpubPage[];
	currentPage?: number;
	onPageChange?: (page: number) => void;
	config?: EpubReaderConfig;
	onConfigChange?: (config: EpubReaderConfig) => void;
	className?: string;
};

function getWordAtPoint(node: Node, offset: number): string {
	const text = node.textContent ?? "";
	if (!text) return "";

	let start = offset;
	let end = offset;

	while (start > 0 && /\w/.test(text[start - 1])) start--;
	while (end < text.length && /\w/.test(text[end])) end++;

	return text.slice(start, end);
}

export function Epub({
	pages,
	currentPage,
	onPageChange,
	config,
	onConfigChange,
	className,
}: EpubProps) {
	const { selectedWord, popupPosition, selectWord, clearSelection } = useEpubStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	const handleDoubleClick = useCallback(
		(e: MouseEvent) => {
			const selection = window.getSelection();
			if (!selection || selection.isCollapsed) return;

			const range = selection.getRangeAt(0);
			const word =
				selection.toString().trim() ||
				getWordAtPoint(range.startContainer, range.startOffset);

			if (!word || !/^[a-zA-Z]+$/.test(word)) return;

			const rect = range.getBoundingClientRect();
			const containerRect = containerRef.current?.getBoundingClientRect();
			if (!containerRect) return;

			selectWord(word, {
				x: rect.left - containerRect.left + rect.width / 2,
				y: rect.bottom - containerRect.top + 4,
			});
		},
		[selectWord],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		container.addEventListener("dblclick", handleDoubleClick);
		return () => container.removeEventListener("dblclick", handleDoubleClick);
	}, [handleDoubleClick]);

	useEffect(() => {
		if (!selectedWord) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				clearSelection();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [selectedWord, clearSelection]);

	useEffect(() => {
		if (!selectedWord) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") clearSelection();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedWord, clearSelection]);

	const classes = [styles.epub, className].filter(Boolean).join(" ");

	return (
		<div className={classes} ref={containerRef}>
			<EpubReader
				pages={pages}
				currentPage={currentPage}
				onPageChange={onPageChange}
				config={config}
				onConfigChange={onConfigChange}
			/>
			{selectedWord && popupPosition && (
				<div
					ref={popupRef}
					className={styles.popup}
					style={{
						left: popupPosition.x,
						top: popupPosition.y,
					}}
				>
					<FreeDictionary word={selectedWord} className={styles.popupContent} />
				</div>
			)}
		</div>
	);
}
