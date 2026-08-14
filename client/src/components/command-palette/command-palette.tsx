import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import styles from "./command-palette.module.scss";

export type CommandItem = {
	id: string;
	label: string;
	group?: string;
	icon?: ReactNode;
	shortcut?: string;
	onSelect: () => void;
};

type CommandPaletteProps = {
	commands: CommandItem[];
	open: boolean;
	onClose: () => void;
	placeholder?: string;
};

function SearchIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
			<path
				d="M10.5 10.5L14 14"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function filterCommands(commands: CommandItem[], query: string): CommandItem[] {
	if (!query) return commands;
	const lower = query.toLowerCase();
	return commands.filter((cmd) => cmd.label.toLowerCase().includes(lower));
}

function groupCommands(
	commands: CommandItem[],
): { group: string; items: CommandItem[] }[] {
	const groups: Map<string, CommandItem[]> = new Map();
	for (const cmd of commands) {
		const key = cmd.group ?? "";
		const list = groups.get(key) ?? [];
		list.push(cmd);
		groups.set(key, list);
	}
	return Array.from(groups, ([group, items]) => ({ group, items }));
}

export function CommandPalette({
	commands,
	open,
	onClose,
	placeholder = "Type a command...",
}: CommandPaletteProps) {
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const filtered = filterCommands(commands, query);
	const grouped = groupCommands(filtered);
	const flatFiltered = grouped.flatMap((g) => g.items);

	useEffect(() => {
		if (open) {
			setQuery("");
			setActiveIndex(0);
			requestAnimationFrame(() => inputRef.current?.focus());
		}
	}, [open]);

	useEffect(() => {
		setActiveIndex(0);
	}, [query]);

	useEffect(() => {
		const active = listRef.current?.querySelector(
			`[data-index="${activeIndex}"]`,
		);
		if (active && "scrollIntoView" in active) {
			active.scrollIntoView({ block: "nearest" });
		}
	}, [activeIndex]);

	const selectItem = (index: number) => {
		const item = flatFiltered[index];
		if (item) {
			onClose();
			item.onSelect();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setActiveIndex((prev) =>
					prev < flatFiltered.length - 1 ? prev + 1 : 0,
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setActiveIndex((prev) =>
					prev > 0 ? prev - 1 : flatFiltered.length - 1,
				);
				break;
			case "Enter":
				e.preventDefault();
				selectItem(activeIndex);
				break;
			case "Escape":
				e.preventDefault();
				onClose();
				break;
		}
	};

	if (!open) return null;

	let flatIndex = 0;

	return (
		<div
			className={styles.backdrop}
			onPointerDown={onClose}
		>
			<div
				className={styles.palette}
				role="dialog"
				aria-modal="true"
				aria-label="Command palette"
				onPointerDown={(e) => e.stopPropagation()}
				onKeyDown={handleKeyDown}
			>
				<div className={styles.inputRow}>
					<span className={styles.inputIcon}>
						<SearchIcon />
					</span>
					<input
						ref={inputRef}
						className={styles.input}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder={placeholder}
						aria-label="Command search"
						aria-activedescendant={
							flatFiltered[activeIndex]
								? `cmd-${flatFiltered[activeIndex].id}`
								: undefined
						}
						role="combobox"
						aria-expanded="true"
						aria-controls="command-list"
						aria-autocomplete="list"
					/>
				</div>
				<div className={styles.list} ref={listRef} id="command-list" role="listbox">
					{flatFiltered.length === 0 && (
						<div className={styles.empty}>No matching commands</div>
					)}
					{grouped.map(({ group, items }) => (
						<div key={group}>
							{group && (
								<div className={styles.groupLabel}>{group}</div>
							)}
							{items.map((cmd) => {
								const idx = flatIndex++;
								const isActive = idx === activeIndex;
								const itemClasses = [
									styles.item,
									isActive && styles["item--active"],
								]
									.filter(Boolean)
									.join(" ");

								return (
									<div
										key={cmd.id}
										id={`cmd-${cmd.id}`}
										className={itemClasses}
										role="option"
										aria-selected={isActive}
										data-index={idx}
										onPointerMove={() => setActiveIndex(idx)}
										onClick={() => selectItem(idx)}
									>
										{cmd.icon && (
											<span className={styles.itemIcon}>{cmd.icon}</span>
										)}
										<span className={styles.itemLabel}>{cmd.label}</span>
										{cmd.shortcut && (
											<kbd className={styles.shortcut}>{cmd.shortcut}</kbd>
										)}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
