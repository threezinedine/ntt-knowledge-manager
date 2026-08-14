import { useCallback, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./epub-reader.module.scss";

export type EpubPage = {
	id: string;
	title?: string;
	content: ReactNode;
};

export type EpubReaderConfig = {
	fontSize: number;
	fontFamily: string;
	lineHeight: number;
};

type EpubReaderProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
	pages: EpubPage[];
	currentPage?: number;
	onPageChange?: (page: number) => void;
	config?: EpubReaderConfig;
	onConfigChange?: (config: EpubReaderConfig) => void;
};

const DEFAULT_CONFIG: EpubReaderConfig = {
	fontSize: 16,
	fontFamily: "serif",
	lineHeight: 1.8,
};

const FONT_FAMILIES = [
	{ value: "serif", label: "Serif" },
	{ value: "sans-serif", label: "Sans-serif" },
	{ value: "monospace", label: "Monospace" },
];

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 28;
const LINE_HEIGHT_MIN = 1.2;
const LINE_HEIGHT_MAX = 2.4;
const LINE_HEIGHT_STEP = 0.2;
const COLUMN_GAP = 48;

function ChevronLeftIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path
				d="M10 3L5 8L10 13"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ChevronRightIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path
				d="M6 3L11 8L6 13"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function MinusIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
			<path
				d="M3 7H11"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function PlusIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
			<path
				d="M7 3V11M3 7H11"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function EpubReader({
	pages,
	currentPage: controlledPage,
	onPageChange,
	config: controlledConfig,
	onConfigChange,
	className,
	...props
}: EpubReaderProps) {
	const [internalPage, setInternalPage] = useState(0);
	const [internalConfig, setInternalConfig] =
		useState<EpubReaderConfig>(DEFAULT_CONFIG);
	const [totalPages, setTotalPages] = useState(1);
	const [colWidth, setColWidth] = useState(0);

	const viewportRef = useRef<HTMLDivElement>(null);
	const flowRef = useRef<HTMLDivElement>(null);

	const page = controlledPage ?? internalPage;
	const config = controlledConfig ?? internalConfig;

	const setPage = (p: number) => {
		const clamped = Math.max(0, Math.min(p, totalPages - 1));
		if (onPageChange) onPageChange(clamped);
		else setInternalPage(clamped);
	};

	const setConfig = (c: EpubReaderConfig) => {
		if (onConfigChange) onConfigChange(c);
		else setInternalConfig(c);
	};

	const measurePages = useCallback(() => {
		const flow = flowRef.current;
		const viewport = viewportRef.current;
		if (!flow || !viewport) return;
		const w = viewport.clientWidth;
		if (w <= 0) return;
		setColWidth(w);
		requestAnimationFrame(() => {
			if (!flowRef.current) return;
			const count = Math.max(
				1,
				Math.round(flowRef.current.scrollWidth / (w + COLUMN_GAP)),
			);
			setTotalPages(count);
		});
	}, []);

	useEffect(() => {
		measurePages();
		const viewport = viewportRef.current;
		if (!viewport || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measurePages);
		observer.observe(viewport);
		return () => observer.disconnect();
	}, [measurePages, pages, config]);

	useEffect(() => {
		if (page >= totalPages && totalPages > 0) {
			setPage(totalPages - 1);
		}
	}, [totalPages]);

	const offset = page * colWidth + page * COLUMN_GAP;

	const canPrev = page > 0;
	const canNext = page < totalPages - 1;

	const updateFontSize = (delta: number) => {
		const next = Math.min(
			FONT_SIZE_MAX,
			Math.max(FONT_SIZE_MIN, config.fontSize + delta),
		);
		setConfig({ ...config, fontSize: next });
	};

	const updateLineHeight = (delta: number) => {
		const next =
			Math.round(
				Math.min(
					LINE_HEIGHT_MAX,
					Math.max(LINE_HEIGHT_MIN, config.lineHeight + delta),
				) * 10,
			) / 10;
		setConfig({ ...config, lineHeight: next });
	};

	const classes = [styles.container, className].filter(Boolean).join(" ");

	return (
		<div className={classes} {...props}>
			<div className={styles.toolbar}>
				<div className={styles.toolGroup}>
					<label className={styles.toolLabel}>Font</label>
					<select
						className={styles.select}
						value={config.fontFamily}
						onChange={(e) =>
							setConfig({ ...config, fontFamily: e.target.value })
						}
						aria-label="Font family"
					>
						{FONT_FAMILIES.map((f) => (
							<option key={f.value} value={f.value}>
								{f.label}
							</option>
						))}
					</select>
				</div>

				<div className={styles.separator} />

				<div className={styles.toolGroup}>
					<label className={styles.toolLabel}>Size</label>
					<button
						className={styles.toolBtn}
						onClick={() => updateFontSize(-1)}
						disabled={config.fontSize <= FONT_SIZE_MIN}
						aria-label="Decrease font size"
					>
						<MinusIcon />
					</button>
					<span className={styles.toolValue} aria-label="Font size">
						{config.fontSize}
					</span>
					<button
						className={styles.toolBtn}
						onClick={() => updateFontSize(1)}
						disabled={config.fontSize >= FONT_SIZE_MAX}
						aria-label="Increase font size"
					>
						<PlusIcon />
					</button>
				</div>

				<div className={styles.separator} />

				<div className={styles.toolGroup}>
					<label className={styles.toolLabel}>Spacing</label>
					<button
						className={styles.toolBtn}
						onClick={() => updateLineHeight(-LINE_HEIGHT_STEP)}
						disabled={config.lineHeight <= LINE_HEIGHT_MIN}
						aria-label="Decrease line height"
					>
						<MinusIcon />
					</button>
					<span className={styles.toolValue} aria-label="Line height">
						{config.lineHeight.toFixed(1)}
					</span>
					<button
						className={styles.toolBtn}
						onClick={() => updateLineHeight(LINE_HEIGHT_STEP)}
						disabled={config.lineHeight >= LINE_HEIGHT_MAX}
						aria-label="Increase line height"
					>
						<PlusIcon />
					</button>
				</div>

				<div className={styles.spacer} />

				<div className={styles.toolGroup}>
					<button
						className={styles.toolBtn}
						onClick={() => setPage(page - 1)}
						disabled={!canPrev}
						aria-label="Previous page"
					>
						<ChevronLeftIcon />
					</button>
					<span className={styles.pageInfo} aria-label="Page indicator">
						{totalPages > 0 ? `${page + 1} / ${totalPages}` : "0 / 0"}
					</span>
					<button
						className={styles.toolBtn}
						onClick={() => setPage(page + 1)}
						disabled={!canNext}
						aria-label="Next page"
					>
						<ChevronRightIcon />
					</button>
				</div>
			</div>

			<div className={styles.content} ref={viewportRef}>
				{pages.length > 0 ? (
					<div
						className={styles.flow}
						ref={flowRef}
						style={{
							fontSize: `${config.fontSize}px`,
							fontFamily: config.fontFamily,
							lineHeight: config.lineHeight,
							transform: `translateX(-${offset}px)`,
							columnWidth: colWidth > 0 ? `${colWidth}px` : undefined,
							columnGap: `${COLUMN_GAP}px`,
						}}
					>
						{pages.map((p) => (
							<section key={p.id} className={styles.section}>
								{p.title && (
									<h2 className={styles.pageTitle}>{p.title}</h2>
								)}
								<div className={styles.pageBody}>{p.content}</div>
							</section>
						))}
					</div>
				) : (
					<div className={styles.empty}>No pages to display</div>
				)}
			</div>
		</div>
	);
}
