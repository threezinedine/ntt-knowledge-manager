import type { HTMLAttributes, ReactNode } from "react";
import styles from "./stateless-dropdown.module.scss";

export type DropdownItem =
	| {
			/** Stable key used as the React key. */
			id: string;
			/** Renders a horizontal divider instead of a selectable item. */
			separator: true;
	  }
	| {
			/** Stable key used as the React key. */
			id: string;
			separator?: false;
			label: ReactNode;
			/** Font Awesome class(es), e.g. "fa-solid fa-star". */
			icon?: string;
			disabled?: boolean;
			/** Red styling for destructive actions. */
			danger?: boolean;
			onSelect?: () => void;
	  };

type DropdownProps = HTMLAttributes<HTMLDivElement> & {
	/** Controls whether the menu is visible. */
	showMenu: boolean;
	items: DropdownItem[];
	/** Called when a non-disabled item is selected. */
	onItemSelect?: (item: DropdownItem) => void;
	/** Accessible label for the menu. */
	menuLabel?: string;
};

export function Dropdown({
	className,
	showMenu,
	items,
	onItemSelect,
	menuLabel = "Dropdown menu",
	children,
	...props
}: DropdownProps) {
	const classes = [styles.dropdown, className].filter(Boolean).join(" ");

	const handleItemClick = (item: DropdownItem) => {
		if (item.separator) {
			return;
		}
		if (item.disabled) {
			return;
		}
		item.onSelect?.();
		onItemSelect?.(item);
	};

	return (
		<div className={classes} {...props}>
			{children}
			{showMenu && (
				<ul className={styles.menu} role="menu" aria-label={menuLabel}>
					{items.map((item) =>
						item.separator ? (
							<li
								key={item.id}
								role="separator"
								className={styles.separator}
							/>
						) : (
							<li key={item.id} role="none">
								<button
									type="button"
									role="menuitem"
									className={[
										styles.item,
										item.danger && styles["item--danger"],
									]
										.filter(Boolean)
										.join(" ")}
									disabled={item.disabled}
									onClick={() => handleItemClick(item)}
								>
									{item.icon && (
										<i
											className={[
												styles["item-icon"],
												item.icon,
											]
												.filter(Boolean)
												.join(" ")}
											aria-hidden="true"
										/>
									)}
									{item.label}
								</button>
							</li>
						),
					)}
				</ul>
			)}
		</div>
	);
}
