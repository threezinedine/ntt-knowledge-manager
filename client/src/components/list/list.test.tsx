import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { List, type ListItem } from "./list";

const ITEMS: ListItem[] = [
	{ id: "1", label: "First" },
	{ id: "2", label: "Second" },
	{ id: "3", label: "Third" },
];

function renderList(props = {}) {
	return render(<List items={ITEMS} {...props} />);
}

describe("List", () => {
	it("renders all items", () => {
		renderList();

		expect(screen.getByRole("option", { name: /First/ })).toBeVisible();
		expect(screen.getByRole("option", { name: /Second/ })).toBeVisible();
		expect(screen.getByRole("option", { name: /Third/ })).toBeVisible();
	});

	it("renders items with icons", () => {
		const items = [
			{ id: "1", label: "Notes", icon: "fa-solid fa-note-sticky" },
		];
		render(<List items={items} />);

		expect(screen.getByRole("option", { name: /Notes/ })).toBeVisible();
	});

	it("marks items as draggable", () => {
		renderList();

		const options = screen.getAllByRole("option");
		for (const option of options) {
			expect(option).toHaveAttribute("draggable", "true");
		}
	});

	it("does not make disabled items draggable", () => {
		const items = [{ id: "1", label: "Locked", disabled: true }];
		render(<List items={items} />);

		const option = screen.getByRole("option", { name: /Locked/ });
		expect(option).toHaveAttribute("draggable", "false");
		expect(option).toHaveAttribute("aria-disabled", "true");
	});

	it("calls onItemSelect when an item is clicked", () => {
		const handleSelect = vi.fn();
		renderList({ onItemSelect: handleSelect });

		fireEvent.click(screen.getByRole("option", { name: /Second/ }));

		expect(handleSelect).toHaveBeenCalledWith(ITEMS[1]);
	});

	it("does not call onItemSelect for disabled items", () => {
		const handleSelect = vi.fn();
		const items = [{ id: "1", label: "Locked", disabled: true }];
		render(<List items={items} onItemSelect={handleSelect} />);

		fireEvent.click(screen.getByRole("option", { name: /Locked/ }));

		expect(handleSelect).not.toHaveBeenCalled();
	});

	it("calls onReorder after a drag-and-drop", () => {
		const handleReorder = vi.fn();
		renderList({ onReorder: handleReorder });

		const options = screen.getAllByRole("option");

		fireEvent.dragStart(options[0], {
			dataTransfer: { effectAllowed: "", setData: vi.fn() },
		});
		fireEvent.dragOver(options[2], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});
		fireEvent.drop(options[2], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});

		expect(handleReorder).toHaveBeenCalledWith([
			ITEMS[1],
			ITEMS[2],
			ITEMS[0],
		]);
	});

	it("supports custom renderItem", () => {
		render(
			<List
				items={ITEMS}
				renderItem={(item) => <strong>{item.label.toUpperCase()}</strong>}
			/>,
		);

		expect(screen.getByText("FIRST")).toBeVisible();
		expect(screen.getByText("SECOND")).toBeVisible();
	});

	it("has listbox role", () => {
		renderList();

		expect(screen.getByRole("listbox")).toBeVisible();
	});
});
