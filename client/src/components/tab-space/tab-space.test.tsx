import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TabSpace, type TabItem } from "./tab-space";

const TABS: TabItem[] = [
	{ id: "one", label: "First", children: <p>Content One</p> },
	{ id: "two", label: "Second", children: <p>Content Two</p> },
	{ id: "three", label: "Third", children: <p>Content Three</p> },
];

describe("TabSpace", () => {
	it("renders all tab buttons", () => {
		render(<TabSpace tabs={TABS} activeId="one" />);

		expect(screen.getByRole("tab", { name: "First" })).toBeVisible();
		expect(screen.getByRole("tab", { name: "Second" })).toBeVisible();
		expect(screen.getByRole("tab", { name: "Third" })).toBeVisible();
	});

	it("renders the active tab content", () => {
		render(<TabSpace tabs={TABS} activeId="two" />);

		expect(screen.getByText("Content Two")).toBeVisible();
		expect(screen.queryByText("Content One")).not.toBeInTheDocument();
		expect(screen.queryByText("Content Three")).not.toBeInTheDocument();
	});

	it("marks the active tab with aria-selected", () => {
		render(<TabSpace tabs={TABS} activeId="one" />);

		expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
			"aria-selected",
			"false",
		);
	});

	it("calls onTabChange when a tab is clicked", () => {
		const handleChange = vi.fn();
		render(
			<TabSpace tabs={TABS} activeId="one" onTabChange={handleChange} />,
		);

		fireEvent.click(screen.getByRole("tab", { name: "Second" }));

		expect(handleChange).toHaveBeenCalledWith("two");
	});

	it("does not call onTabChange for disabled tabs", () => {
		const handleChange = vi.fn();
		const tabs: TabItem[] = [
			{ id: "a", label: "Active", children: <p>A</p> },
			{ id: "b", label: "Locked", children: <p>B</p>, disabled: true },
		];
		render(
			<TabSpace tabs={tabs} activeId="a" onTabChange={handleChange} />,
		);

		fireEvent.click(screen.getByRole("tab", { name: "Locked" }));

		expect(handleChange).not.toHaveBeenCalled();
	});

	it("has tablist and tabpanel roles", () => {
		render(<TabSpace tabs={TABS} activeId="one" />);

		expect(screen.getByRole("tablist")).toBeVisible();
		expect(screen.getByRole("tabpanel")).toBeVisible();
	});

	it("sets aria-controls linking tab to panel", () => {
		render(<TabSpace tabs={TABS} activeId="one" />);

		const tab = screen.getByRole("tab", { name: "First" });
		const panel = screen.getByRole("tabpanel");

		expect(tab).toHaveAttribute("aria-controls", panel.id);
	});

	it("renders close buttons when onClose is provided", () => {
		const handleClose = vi.fn();
		render(
			<TabSpace tabs={TABS} activeId="one" onClose={handleClose} />,
		);

		const closeButtons = screen.getAllByRole("button", { name: /Close/ });
		expect(closeButtons).toHaveLength(3);
	});

	it("calls onClose with the tab id when close is clicked", () => {
		const handleClose = vi.fn();
		render(
			<TabSpace tabs={TABS} activeId="one" onClose={handleClose} />,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Close Second" }),
		);

		expect(handleClose).toHaveBeenCalledWith("two");
	});

	it("does not render close button for disabled tabs", () => {
		const tabs: TabItem[] = [
			{ id: "a", label: "Open", children: <p>A</p> },
			{ id: "b", label: "Locked", children: <p>B</p>, disabled: true },
		];
		render(
			<TabSpace tabs={tabs} activeId="a" onClose={vi.fn()} />,
		);

		expect(screen.getByRole("button", { name: "Close Open" })).toBeVisible();
		expect(screen.queryByRole("button", { name: "Close Locked" })).not.toBeInTheDocument();
	});

	it("does not change active tab when close is clicked", () => {
		const handleChange = vi.fn();
		const handleClose = vi.fn();
		render(
			<TabSpace
				tabs={TABS}
				activeId="one"
				onTabChange={handleChange}
				onClose={handleClose}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Close Second" }),
		);

		expect(handleClose).toHaveBeenCalledWith("two");
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("makes tabs draggable", () => {
		render(<TabSpace tabs={TABS} activeId="one" />);

		const tabElements = screen.getAllByRole("tab");
		for (const tab of tabElements) {
			expect(tab).toHaveAttribute("draggable", "true");
		}
	});

	it("calls onReorder after drag-and-drop", () => {
		const handleReorder = vi.fn();
		render(
			<TabSpace
				tabs={TABS}
				activeId="one"
				onReorder={handleReorder}
			/>,
		);

		const tabElements = screen.getAllByRole("tab");

		fireEvent.dragStart(tabElements[0], {
			dataTransfer: { effectAllowed: "", setData: vi.fn() },
		});
		fireEvent.dragOver(tabElements[2], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});
		fireEvent.drop(tabElements[2], {
			dataTransfer: { dropEffect: "" },
			preventDefault: vi.fn(),
		});

		expect(handleReorder).toHaveBeenCalledWith([
			TABS[1],
			TABS[2],
			TABS[0],
		]);
	});
});
