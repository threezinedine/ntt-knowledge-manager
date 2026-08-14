import { useCallback, useEffect, useRef, useState } from "react";
import type { DragEvent, HTMLAttributes, MouseEvent, ReactNode } from "react";
import styles from "./tab-space.module.scss";

export type TabItem = {
	id: string;
	label: ReactNode;
	children: ReactNode;
	disabled?: boolean;
};

type TabSpaceProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
	tabs: TabItem[];
	activeId: string;
	onTabChange?: (id: string) => void;
	onClose?: (id: string) => void;
	onReorder?: (tabs: TabItem[]) => void;
};

function CloseIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

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

const SCROLL_AMOUNT = 160;

export function TabSpace({
	tabs,
	activeId,
	onTabChange,
	onClose,
	onReorder,
	className,
	...props
}: TabSpaceProps) {
	const activeTab = tabs.find((t) => t.id === activeId);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [dropIndex, setDropIndex] = useState<number | null>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const dragCounter = useRef<Map<number, number>>(new Map());
	const scrollRef = useRef<HTMLDivElement>(null);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 0);
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	useEffect(() => {
		updateScrollState();
		const el = scrollRef.current;
		if (!el) return;
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(updateScrollState);
		observer.observe(el);
		return () => observer.disconnect();
	}, [updateScrollState, tabs.length]);

	const scrollLeft = () => {
		scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
	};

	const handleDragStart = (index: number, e: DragEvent) => {
		setDragIndex(index);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", String(index));
	};

	const handleDragOver = (index: number, e: DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		const count = (dragCounter.current.get(index) ?? 0) + 1;
		dragCounter.current.set(index, count);
		if (index !== dragIndex) {
			setDropIndex(index);
		}
	};

	const handleDragLeave = (index: number) => {
		const count = (dragCounter.current.get(index) ?? 1) - 1;
		dragCounter.current.set(index, count);
		if (count <= 0) {
			dragCounter.current.delete(index);
			if (dropIndex === index) {
				setDropIndex(null);
			}
		}
	};

	const handleDrop = (targetIndex: number, e: DragEvent) => {
		e.preventDefault();
		dragCounter.current.clear();

		if (dragIndex !== null && dragIndex !== targetIndex) {
			const reordered = [...tabs];
			const [moved] = reordered.splice(dragIndex, 1);
			reordered.splice(targetIndex, 0, moved);
			onReorder?.(reordered);
		}

		setDragIndex(null);
		setDropIndex(null);
	};

	const handleDragEnd = () => {
		dragCounter.current.clear();
		setDragIndex(null);
		setDropIndex(null);
	};

	const handleClose = (id: string, e: MouseEvent) => {
		e.stopPropagation();
		onClose?.(id);
	};

	const showScrollButtons = canScrollLeft || canScrollRight;
	const classes = [styles.container, className].filter(Boolean).join(" ");

	return (
		<div className={classes} {...props}>
			<div className={styles.header}>
				{showScrollButtons && (
					<button
						className={[
							styles.scrollBtn,
							!canScrollLeft && styles["scrollBtn--disabled"],
						]
							.filter(Boolean)
							.join(" ")}
						onClick={scrollLeft}
						aria-label="Scroll tabs left"
						tabIndex={-1}
						disabled={!canScrollLeft}
					>
						<ChevronLeftIcon />
					</button>
				)}
				<div
					className={styles.bar}
					role="tablist"
					ref={scrollRef}
					onScroll={updateScrollState}
				>
					{tabs.map((tab, index) => {
						const isActive = tab.id === activeId;
						const isDragging = dragIndex === index;
						const isDropTarget = dropIndex === index;
						const tabClasses = [
							styles.tab,
							isActive && styles["tab--active"],
							tab.disabled && styles["tab--disabled"],
							isDragging && styles["tab--dragging"],
							isDropTarget && styles["tab--drop-target"],
						]
							.filter(Boolean)
							.join(" ");

						return (
							<div
								key={tab.id}
								className={tabClasses}
								role="tab"
								aria-selected={isActive}
								aria-disabled={tab.disabled || undefined}
								aria-controls={`tabpanel-${tab.id}`}
								tabIndex={isActive ? 0 : -1}
								draggable={!tab.disabled}
								onClick={() => {
									if (!tab.disabled) onTabChange?.(tab.id);
								}}
								onDragStart={(e) => handleDragStart(index, e)}
								onDragOver={(e) => handleDragOver(index, e)}
								onDragLeave={() => handleDragLeave(index)}
								onDrop={(e) => handleDrop(index, e)}
								onDragEnd={handleDragEnd}
							>
								<span className={styles.label}>{tab.label}</span>
								{onClose && !tab.disabled && (
									<button
										className={styles.close}
										onClick={(e) => handleClose(tab.id, e)}
										aria-label={`Close ${typeof tab.label === "string" ? tab.label : tab.id}`}
										tabIndex={-1}
									>
										<CloseIcon />
									</button>
								)}
							</div>
						);
					})}
				</div>
				{showScrollButtons && (
					<button
						className={[
							styles.scrollBtn,
							!canScrollRight && styles["scrollBtn--disabled"],
						]
							.filter(Boolean)
							.join(" ")}
						onClick={scrollRight}
						aria-label="Scroll tabs right"
						tabIndex={-1}
						disabled={!canScrollRight}
					>
						<ChevronRightIcon />
					</button>
				)}
			</div>
			{activeTab && (
				<div
					className={styles.panel}
					role="tabpanel"
					id={`tabpanel-${activeTab.id}`}
				>
					{activeTab.children}
				</div>
			)}
		</div>
	);
}
