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

export function List({
	items,
	onReorder,
	className,
	...props
}: ListProps) {
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [dropIndex, setDropIndex] = useState<number | null>(null);
	const dragCounter = useRef<Map<number, number>>(new Map());

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
		if (dragIndex === null || dragIndex === targetIndex) {
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
	};

	const handleDragEnd = () => {
		dragCounter.current.clear();
		setDragIndex(null);
		setDropIndex(null);
	};

	const classes = [styles.list, className].filter(Boolean).join(" ");

	return (
		<ul className={classes} role="list" {...props}>
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
