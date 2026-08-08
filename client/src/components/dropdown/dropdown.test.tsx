import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dropdown, type DropdownItem } from "./dropdown";

const ITEMS: DropdownItem[] = [
	{ id: "rename", label: "Rename" },
	{ id: "delete", label: "Delete", danger: true },
];

function renderDropdown(props = {}) {
	return render(
		<Dropdown items={ITEMS} {...props}>
			<button type="button">Actions</button>
		</Dropdown>,
	);
}

describe("Dropdown", () => {
	it("renders the trigger children at all times", () => {
		renderDropdown();

		expect(screen.getByRole("button", { name: "Actions" })).toBeVisible();
	});

	it("does not render the menu while closed", () => {
		renderDropdown();

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
			"aria-expanded",
			"false",
		);
	});

	it("opens the menu when the trigger is clicked", () => {
		renderDropdown();

		fireEvent.click(screen.getByRole("button", { name: "Actions" }));

		expect(screen.getByRole("menu")).toBeVisible();
		expect(screen.getByRole("menuitem", { name: "Rename" })).toBeVisible();
		expect(screen.getByRole("menuitem", { name: "Delete" })).toBeVisible();
		expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
	});

	it("closes the menu when the trigger is clicked again", () => {
		renderDropdown();

		const trigger = screen.getByRole("button", { name: "Actions" });
		fireEvent.click(trigger);
		fireEvent.click(trigger);

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("uses defaultOpen as the initial state", () => {
		renderDropdown({ defaultOpen: true });

		expect(screen.getByRole("menu")).toBeVisible();
	});

	it("reports open changes through onOpenChange", () => {
		const handleChange = vi.fn();
		renderDropdown({ onOpenChange: handleChange });

		const trigger = screen.getByRole("button", { name: "Actions" });
		fireEvent.click(trigger);
		expect(handleChange).toHaveBeenCalledWith(true);

		fireEvent.click(trigger);
		expect(handleChange).toHaveBeenCalledWith(false);
	});

	it("calls onItemSelect and closes when an item is selected", () => {
		const handleSelect = vi.fn();
		renderDropdown({ onItemSelect: handleSelect });

		fireEvent.click(screen.getByRole("button", { name: "Actions" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));

		expect(handleSelect).toHaveBeenCalledWith(ITEMS[0]);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("calls the item's own onSelect callback", () => {
		const handleItemSelect = vi.fn();
		const items = [
			{ id: "rename", label: "Rename", onSelect: handleItemSelect },
		];
		render(
			<Dropdown items={items}>
				<button type="button">Actions</button>
			</Dropdown>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Actions" }));
		fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));

		expect(handleItemSelect).toHaveBeenCalledOnce();
	});

	it("does not select a disabled item and keeps the menu open", () => {
		const handleSelect = vi.fn();
		const items = [{ id: "delete", label: "Delete", disabled: true }];
		render(
			<Dropdown items={items} onItemSelect={handleSelect}>
				<button type="button">Actions</button>
			</Dropdown>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Actions" }));
		const item = screen.getByRole("menuitem", { name: "Delete" });
		expect(item).toBeDisabled();
		fireEvent.click(item);

		expect(handleSelect).not.toHaveBeenCalled();
		expect(screen.getByRole("menu")).toBeVisible();
	});

	it("closes when the user clicks outside", () => {
		renderDropdown({ defaultOpen: true });
		expect(screen.getByRole("menu")).toBeVisible();

		fireEvent(
			document.body,
			new MouseEvent("pointerdown", { bubbles: true }),
		);

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("closes when the Escape key is pressed", () => {
		renderDropdown({ defaultOpen: true });
		expect(screen.getByRole("menu")).toBeVisible();

		fireEvent.keyDown(document, { key: "Escape" });

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});
});
