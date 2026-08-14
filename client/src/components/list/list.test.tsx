import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { List, type ListItem } from "./list";

const ITEMS: ListItem[] = [
	{ id: "1", children: <span>First</span> },
	{ id: "2", children: <span>Second</span> },
	{ id: "3", children: <span>Third</span> },
];

function renderList(props = {}) {
	return render(<List items={ITEMS} {...props} />);
}

describe("List", () => {
	it("renders all items", () => {
		renderList();

		expect(screen.getByText("First")).toBeVisible();
		expect(screen.getByText("Second")).toBeVisible();
		expect(screen.getByText("Third")).toBeVisible();
	});

	it("renders custom children inside items", () => {
		const items: ListItem[] = [
			{
				id: "1",
				children: (
					<div>
						<strong>Title</strong>
						<p>Description</p>
					</div>
				),
			},
		];
		render(<List items={items} />);

		expect(screen.getByText("Title")).toBeVisible();
		expect(screen.getByText("Description")).toBeVisible();
	});

	it("marks items as draggable", () => {
		renderList();

		const items = screen.getAllByRole("listitem");
		for (const item of items) {
			expect(item).toHaveAttribute("draggable", "true");
		}
	});

	it("does not make disabled items draggable", () => {
		const items: ListItem[] = [
			{ id: "1", children: <span>Locked</span>, disabled: true },
		];
		render(<List items={items} />);

		const item = screen.getByRole("listitem");
		expect(item).toHaveAttribute("draggable", "false");
		expect(item).toHaveAttribute("aria-disabled", "true");
	});

	it("calls onReorder after a drag-and-drop", () => {
		const handleReorder = vi.fn();
		renderList({ onReorder: handleReorder });

		const items = screen.getAllByRole("listitem");

		fireEvent.dragStart(items[0], {
			dataTransfer: { effectAllowed: "", setData: vi.fn() },
		});
		fireEvent.dragOver(items[2], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});
		fireEvent.drop(items[2], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});

		expect(handleReorder).toHaveBeenCalledWith([
			ITEMS[1],
			ITEMS[2],
			ITEMS[0],
		]);
	});

	it("does not call onReorder when dropped on same position", () => {
		const handleReorder = vi.fn();
		renderList({ onReorder: handleReorder });

		const items = screen.getAllByRole("listitem");

		fireEvent.dragStart(items[1], {
			dataTransfer: { effectAllowed: "", setData: vi.fn() },
		});
		fireEvent.drop(items[1], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});

		expect(handleReorder).not.toHaveBeenCalled();
	});

	it("has list role", () => {
		renderList();

		expect(screen.getByRole("list")).toBeVisible();
	});

	it("accepts groupId, onReceive, and onRemove props without error", () => {
		const onReceive = vi.fn();
		const onRemove = vi.fn();
		render(
			<List
				items={ITEMS}
				groupId="test-group"
				onReceive={onReceive}
				onRemove={onRemove}
			/>,
		);

		expect(screen.getAllByRole("listitem")).toHaveLength(3);
	});

	it("sets transfer data on dragStart when groupId is set", () => {
		const setData = vi.fn();
		render(<List items={ITEMS} groupId="my-group" />);

		const items = screen.getAllByRole("listitem");
		fireEvent.dragStart(items[0], {
			dataTransfer: { effectAllowed: "", setData },
		});

		expect(setData).toHaveBeenCalledWith("text/plain", "0");
		expect(setData).toHaveBeenCalledWith(
			"application/x-list-transfer",
			expect.stringContaining('"groupId":"my-group"'),
		);
	});
});
