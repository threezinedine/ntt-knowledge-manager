import {
	Children,
	cloneElement,
	isValidElement,
	useEffect,
	useRef,
	useState,
} from "react";
import type {
	HTMLAttributes,
	MouseEvent as ReactMouseEvent,
	MouseEventHandler,
	ReactNode,
} from "react";
import { Dropdown as StatelessDropdown } from "../stateless-dropdown";
import type { DropdownItem } from "../stateless-dropdown";

export type { DropdownItem } from "../stateless-dropdown";

type TriggerElementProps = {
	onClick?: MouseEventHandler;
	"aria-haspopup"?: "menu";
	"aria-expanded"?: boolean;
};

type DropdownProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	// "onSelect" is a native div attribute (synthetic select event) that must be
	// omitted so it cannot be confused with item selection.
	"onSelect" | "children"
> & {
	/** Initial open state; the component keeps its own state afterwards. */
	defaultOpen?: boolean;
	/** Called whenever the menu opens or closes. */
	onOpenChange?: (open: boolean) => void;
	items: DropdownItem[];
	/** Called when a non-disabled item is selected. */
	onItemSelect?: (item: DropdownItem) => void;
	/** Accessible label for the menu. */
	menuLabel?: string;
	/** The trigger element; clicking it toggles the menu. */
	children?: ReactNode;
};

export function Dropdown({
	defaultOpen = false,
	onOpenChange,
	onItemSelect,
	items,
	menuLabel,
	children,
	...props
}: DropdownProps) {
	const [open, setOpen] = useState(defaultOpen);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (
				rootRef.current &&
				event.target instanceof Node &&
				!rootRef.current.contains(event.target)
			) {
				setOpen(false);
				onOpenChange?.(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
				onOpenChange?.(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, onOpenChange]);

	const toggle = () => {
		const next = !open;
		setOpen(next);
		onOpenChange?.(next);
	};

	const trigger = Children.map(children, (child) => {
		if (!isValidElement<TriggerElementProps>(child)) {
			return child;
		}
		return cloneElement(child, {
			"aria-haspopup": "menu",
			"aria-expanded": open,
			onClick: (event: ReactMouseEvent) => {
				child.props.onClick?.(event);
				toggle();
			},
		});
	});

	return (
		<StatelessDropdown
			ref={rootRef}
			showMenu={open}
			items={items}
			onItemSelect={(item) => {
				setOpen(false);
				onOpenChange?.(false);
				onItemSelect?.(item);
			}}
			menuLabel={menuLabel}
			{...props}
		>
			{trigger}
		</StatelessDropdown>
	);
}
