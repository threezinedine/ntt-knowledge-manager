import { useCallback, useEffect, useRef, useState } from "react";
import { EpubReader, type EpubPage, type EpubReaderConfig } from "../../../components";
import { FreeDictionary } from "../../dictionary";
import { FreeTranslator } from "../../translator";
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

const POPUP_WIDTH = 380;
const POPUP_MAX_HEIGHT = 350;
const POPUP_GAP = 4;
const CONTEXT_MENU_WIDTH = 160;
const CONTEXT_MENU_HEIGHT = 80;

function clampPopup(
	rawX: number,
	wordBottom: number,
	wordTop: number,
	containerW: number,
	containerH: number,
	popupW: number,
	popupH: number,
): { left: number; top: number } {
	const halfW = popupW / 2;
	const left = Math.max(halfW, Math.min(rawX, containerW - halfW));

	let top = wordBottom + POPUP_GAP;
	if (top + popupH > containerH) {
		top = wordTop - POPUP_GAP - popupH;
	}
	if (top < 0) top = POPUP_GAP;

	return { left, top };
}

export function Epub({
	pages,
	currentPage,
	onPageChange,
	config,
	onConfigChange,
	className,
}: EpubProps) {
	const {
		selectedText,
		view,
		popupPosition,
		wordTop: storedWordTop,
		containerWidth: storedContainerW,
		containerHeight: storedContainerH,
		showContextMenu,
		showDictionary,
		showTranslator,
		clearSelection,
	} = useEpubStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	const handleMouseUp = useCallback(
		(e: MouseEvent) => {
			if (popupRef.current?.contains(e.target as Node)) return;

			const selection = window.getSelection();
			if (!selection || selection.isCollapsed) return;

			const text = selection.toString().trim();
			if (!text) return;

			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			const container = containerRef.current;
			if (!container) return;
			const containerRect = container.getBoundingClientRect();

			const rawX = rect.left - containerRect.left + rect.width / 2;
			const wordBottom = rect.bottom - containerRect.top;
			const wTop = rect.top - containerRect.top;

			showContextMenu(text, { x: rawX, y: wordBottom }, wTop, containerRect.width, containerRect.height);
		},
		[showContextMenu],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		container.addEventListener("mouseup", handleMouseUp);
		return () => container.removeEventListener("mouseup", handleMouseUp);
	}, [handleMouseUp]);

	const dismiss = useCallback(() => {
		clearSelection();
	}, [clearSelection]);

	useEffect(() => {
		if (!selectedText) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				dismiss();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [selectedText, dismiss]);

	useEffect(() => {
		if (!selectedText) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") dismiss();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedText, dismiss]);

	const classes = [styles.epub, className].filter(Boolean).join(" ");

	let popupContent = null;

	if (selectedText && popupPosition && view === "context-menu") {
		const pos = clampPopup(
			popupPosition.x,
			popupPosition.y,
			storedWordTop,
			storedContainerW,
			storedContainerH,
			CONTEXT_MENU_WIDTH,
			CONTEXT_MENU_HEIGHT,
		);
		popupContent = (
			<div
				ref={popupRef}
				className={styles.contextMenu}
				style={{ left: pos.left, top: pos.top }}
			>
				<button
					type="button"
					className={styles.contextMenuItem}
					onClick={() => showDictionary()}
				>
					Dictionary
				</button>
				<button
					type="button"
					className={styles.contextMenuItem}
					onClick={() => showTranslator()}
				>
					Translate
				</button>
			</div>
		);
	}

	if (selectedText && popupPosition && view === "dictionary") {
		const pos = clampPopup(
			popupPosition.x,
			popupPosition.y,
			storedWordTop,
			storedContainerW,
			storedContainerH,
			POPUP_WIDTH,
			POPUP_MAX_HEIGHT,
		);
		popupContent = (
			<div
				ref={popupRef}
				className={styles.popup}
				style={{ left: pos.left, top: pos.top }}
			>
				<FreeDictionary word={selectedText} className={styles.popupContent} />
			</div>
		);
	}

	if (selectedText && popupPosition && view === "translator") {
		const pos = clampPopup(
			popupPosition.x,
			popupPosition.y,
			storedWordTop,
			storedContainerW,
			storedContainerH,
			POPUP_WIDTH,
			POPUP_MAX_HEIGHT,
		);
		popupContent = (
			<div
				ref={popupRef}
				className={styles.popup}
				style={{ left: pos.left, top: pos.top }}
			>
				<FreeTranslator text={selectedText} className={styles.popupContent} />
			</div>
		);
	}

	return (
		<div className={classes} ref={containerRef}>
			<EpubReader
				pages={pages}
				currentPage={currentPage}
				onPageChange={onPageChange}
				config={config}
				onConfigChange={onConfigChange}
			/>
			{popupContent}
		</div>
	);
}
