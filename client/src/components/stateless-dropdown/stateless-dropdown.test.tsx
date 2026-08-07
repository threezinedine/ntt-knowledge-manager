import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dropdown, type DropdownItem } from "./stateless-dropdown";

const ITEMS: DropdownItem[] = [
	{ id: "rename", label: "Rename" },
	{ id: "delete", label: "Delete", danger: true },
];

describe("Dropdown", () => {
	it("renders the trigger children at all times", () => {
		render(
			<Dropdown showMenu={false} items={ITEMS}>
				<button>Actions</button>
			</Dropdown>,
		);

		expect(screen.getByRole("button", { name: "Actions" })).toBeVisible();
	});

	it("does not render the menu while closed", () => {
		render(
			<Dropdown showMenu={false} items={ITEMS}>
				<button>Actions</button>
			</Dropdown>,
		);

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("renders the menu with items when open", () => {
		render(
			<Dropdown showMenu items={ITEMS}>
				<button>Actions</button>
			</Dropdown>,
		);

		expect(screen.getByRole("menu")).toBeVisible();
		expect(screen.getByRole("menuitem", { name: "Rename" })).toBeVisible();
		expect(screen.getByRole("menuitem", { name: "Delete" })).toBeVisible();
	});

	it("calls onItemSelect when an item is clicked", () => {
		const handleSelect = vi.fn();
		render(
			<Dropdown showMenu items={ITEMS} onItemSelect={handleSelect}>
				<button>Actions</button>
			</Dropdown>,
		);

		fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
		expect(handleSelect).toHaveBeenCalledWith(ITEMS[0]);
	});

	it("calls the item's own onSelect callback", () => {
		const handleItemSelect = vi.fn();
		const items = [
			{ id: "rename", label: "Rename", onSelect: handleItemSelect },
		];
		render(
			<Dropdown showMenu items={items}>
				<button>Actions</button>
			</Dropdown>,
		);

		fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
		expect(handleItemSelect).toHaveBeenCalledOnce();
	});

	it("does not select a disabled item", () => {
		const handleSelect = vi.fn();
		const items = [{ id: "delete", label: "Delete", disabled: true }];
		render(
			<Dropdown showMenu items={items} onItemSelect={handleSelect}>
				<button>Actions</button>
			</Dropdown>,
		);

		const item = screen.getByRole("menuitem", { name: "Delete" });
		expect(item).toBeDisabled();
		fireEvent.click(item);
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it("renders separators as dividers, not selectable items", () => {
		const handleSelect = vi.fn();
		const items: DropdownItem[] = [
			{ id: "rename", label: "Rename" },
			{ id: "separator-1", separator: true },
			{ id: "delete", label: "Delete", danger: true },
		];
		render(
			<Dropdown showMenu items={items} onItemSelect={handleSelect}>
				<button>Actions</button>
			</Dropdown>,
		);

		expect(screen.getByRole("separator")).toBeVisible();
		expect(screen.getAllByRole("menuitem")).toHaveLength(2);
		expect(handleSelect).not.toHaveBeenCalled();
	});
});
