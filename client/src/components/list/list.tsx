import { useRef, useState } from "react";
import type { DragEvent, HTMLAttributes, ReactNode } from "react";
import styles from "./list.module.scss";

export type ListItem = {
	id: string;
	children: ReactNode;
	disabled?: boolean;
};

type ListProps = Omit<HTMLAttributes<HTMLUListElement>, "children"> & {
	items: ListItem[];
	onReorder?: (items: ListItem[]) => void;
	/** When set, items can be dragged between lists sharing the same groupId. */
	groupId?: string;
	/** Called when an item is dropped from another list with the same groupId. */
	onReceive?: (item: ListItem, atIndex: number) => void;
	/** Called when an item is dragged out to another list with the same groupId. */
	onRemove?: (item: ListItem) => void;
};

function Item({
	disabled,
	isDragging,
	isDropTarget,
	onDragStart,
	onDragOver,
	onDragLeave,
	onDrop,
	onDragEnd,
	children,
}: {
	disabled?: boolean;
	isDragging: boolean;
	isDropTarget: boolean;
	onDragStart: (e: DragEvent) => void;
	onDragOver: (e: DragEvent) => void;
	onDragLeave: () => void;
	onDrop: (e: DragEvent) => void;
	onDragEnd: () => void;
	children: ReactNode;
}) {
	const classes = [
		styles.item,
		isDragging && styles["item--dragging"],
		isDropTarget && styles["item--drop-target"],
		disabled && styles["item--disabled"],
	]
		.filter(Boolean)
		.join(" ");

	return (
		<li
			className={classes}
			draggable={!disabled}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			onDragEnd={onDragEnd}
			role="listitem"
			aria-disabled={disabled || undefined}
		>
			<span className={styles.grip} aria-hidden="true">
				<i className="fa-solid fa-grip-vertical" />
			</span>
			<div className={styles.content}>{children}</div>
		</li>
	);
}

const MIME = "application/x-list-transfer";

function encodeTransfer(groupId: string, item: ListItem) {
	return JSON.stringify({ groupId, id: item.id });
}

function decodeTransfer(
	data: string,
	expectedGroupId: string,
): { id: string } | null {
	try {
		const parsed = JSON.parse(data);
		if (parsed.groupId === expectedGroupId) return parsed;
	} catch {
		/* not a transfer payload */
	}
	return null;
}

export function List({
	items,
	onReorder,
	groupId,
	onReceive,
	onRemove,
	className,
	...props
}: ListProps) {
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [dropIndex, setDropIndex] = useState<number | null>(null);
	const [isExternalOver, setIsExternalOver] = useState(false);
	const dragCounter = useRef<Map<number, number>>(new Map());
	const panelCounter = useRef(0);
	const droppedInternally = useRef(false);

	const handleDragStart = (index: number, e: DragEvent) => {
		droppedInternally.current = false;
		setDragIndex(index);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", String(index));
		if (groupId) {
			e.dataTransfer.setData(MIME, encodeTransfer(groupId, items[index]));
		}
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
		e.stopPropagation();
		dragCounter.current.clear();
		panelCounter.current = 0;
		setIsExternalOver(false);

		if (dragIndex !== null) {
			droppedInternally.current = true;
			if (dragIndex === targetIndex) {
				setDragIndex(null);
				setDropIndex(null);
				return;
			}
			const reordered = [...items];
			const [moved] = reordered.splice(dragIndex, 1);
			reordered.splice(targetIndex, 0, moved);
			onReorder?.(reordered);
			setDragIndex(null);
			setDropIndex(null);
			return;
		}

		if (groupId) {
			const payload = decodeTransfer(
				e.dataTransfer.getData(MIME),
				groupId,
			);
			if (payload) {
				onReceive?.(
					{ id: payload.id, children: null },
					targetIndex,
				);
			}
		}

		setDragIndex(null);
		setDropIndex(null);
	};

	const handleDragEnd = () => {
		const wasInternal = droppedInternally.current;
		dragCounter.current.clear();
		panelCounter.current = 0;
		setDropIndex(null);
		setIsExternalOver(false);

		if (groupId && dragIndex !== null && !wasInternal) {
			const item = items[dragIndex];
			if (item) {
				onRemove?.(item);
			}
		}

		setDragIndex(null);
		droppedInternally.current = false;
	};

	const handleListDragOver = (e: DragEvent) => {
		if (dragIndex !== null) return;
		if (!groupId) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		panelCounter.current++;
		setIsExternalOver(true);
	};

	const handleListDragLeave = () => {
		panelCounter.current--;
		if (panelCounter.current <= 0) {
			panelCounter.current = 0;
			setIsExternalOver(false);
		}
	};

	const handleListDrop = (e: DragEvent) => {
		e.preventDefault();
		panelCounter.current = 0;
		setIsExternalOver(false);

		if (dragIndex !== null || !groupId) return;

		const payload = decodeTransfer(e.dataTransfer.getData(MIME), groupId);
		if (payload) {
			onReceive?.({ id: payload.id, children: null }, items.length);
		}
	};

	const classes = [
		styles.list,
		isExternalOver && styles["list--drop-zone"],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<ul
			className={classes}
			role="list"
			onDragOver={handleListDragOver}
			onDragLeave={handleListDragLeave}
			onDrop={handleListDrop}
			{...props}
		>
			{items.map((item, index) => (
				<Item
					key={item.id}
					disabled={item.disabled}
					isDragging={dragIndex === index}
					isDropTarget={dropIndex === index}
					onDragStart={(e) => handleDragStart(index, e)}
					onDragOver={(e) => handleDragOver(index, e)}
					onDragLeave={() => handleDragLeave(index)}
					onDrop={(e) => handleDrop(index, e)}
					onDragEnd={handleDragEnd}
				>
					{item.children}
				</Item>
			))}
		</ul>
	);
}
