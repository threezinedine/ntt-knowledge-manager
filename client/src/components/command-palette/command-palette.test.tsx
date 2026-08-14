import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette, type CommandItem } from "./command-palette";

const COMMANDS: CommandItem[] = [
	{ id: "save", label: "Save File", group: "File", onSelect: vi.fn() },
	{ id: "open", label: "Open File", group: "File", onSelect: vi.fn() },
	{ id: "theme", label: "Toggle Theme", group: "View", onSelect: vi.fn() },
	{ id: "zoom-in", label: "Zoom In", group: "View", onSelect: vi.fn() },
];

function renderPalette(props = {}) {
	return render(
		<CommandPalette
			commands={COMMANDS}
			open={true}
			onClose={vi.fn()}
			{...props}
		/>,
	);
}

describe("CommandPalette", () => {
	it("renders nothing when closed", () => {
		render(
			<CommandPalette
				commands={COMMANDS}
				open={false}
				onClose={vi.fn()}
			/>,
		);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders all commands when open", () => {
		renderPalette();

		expect(screen.getByText("Save File")).toBeVisible();
		expect(screen.getByText("Open File")).toBeVisible();
		expect(screen.getByText("Toggle Theme")).toBeVisible();
		expect(screen.getByText("Zoom In")).toBeVisible();
	});

	it("renders group labels", () => {
		renderPalette();

		expect(screen.getByText("File")).toBeVisible();
		expect(screen.getByText("View")).toBeVisible();
	});

	it("filters commands by query", () => {
		renderPalette();

		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "zoom" } });

		expect(screen.getByText("Zoom In")).toBeVisible();
		expect(screen.queryByText("Save File")).not.toBeInTheDocument();
		expect(screen.queryByText("Open File")).not.toBeInTheDocument();
	});

	it("shows empty state when no commands match", () => {
		renderPalette();

		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "xyznotfound" } });

		expect(screen.getByText("No matching commands")).toBeVisible();
	});

	it("calls onSelect when a command is clicked", () => {
		const onSelect = vi.fn();
		const onClose = vi.fn();
		const commands: CommandItem[] = [
			{ id: "test", label: "Test Command", onSelect },
		];
		render(
			<CommandPalette
				commands={commands}
				open={true}
				onClose={onClose}
			/>,
		);

		fireEvent.click(screen.getByText("Test Command"));

		expect(onClose).toHaveBeenCalled();
		expect(onSelect).toHaveBeenCalled();
	});

	it("calls onClose when Escape is pressed", () => {
		const onClose = vi.fn();
		renderPalette({ onClose });

		const input = screen.getByRole("combobox");
		fireEvent.keyDown(input, { key: "Escape" });

		expect(onClose).toHaveBeenCalled();
	});

	it("calls onClose when backdrop is clicked", () => {
		const onClose = vi.fn();
		renderPalette({ onClose });

		const backdrop = screen.getByRole("dialog").parentElement!;
		fireEvent.pointerDown(backdrop);

		expect(onClose).toHaveBeenCalled();
	});

	it("navigates with arrow keys and selects with Enter", () => {
		const onSelect = vi.fn();
		const onClose = vi.fn();
		const commands: CommandItem[] = [
			{ id: "a", label: "Alpha", onSelect: vi.fn() },
			{ id: "b", label: "Beta", onSelect },
		];
		render(
			<CommandPalette
				commands={commands}
				open={true}
				onClose={onClose}
			/>,
		);

		const input = screen.getByRole("combobox");
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSelect).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();
	});

	it("wraps around when navigating past last item", () => {
		const onSelect = vi.fn();
		const commands: CommandItem[] = [
			{ id: "a", label: "Alpha", onSelect },
			{ id: "b", label: "Beta", onSelect: vi.fn() },
		];
		render(
			<CommandPalette
				commands={commands}
				open={true}
				onClose={vi.fn()}
			/>,
		);

		const input = screen.getByRole("combobox");
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSelect).toHaveBeenCalled();
	});

	it("renders shortcut badges", () => {
		const commands: CommandItem[] = [
			{
				id: "save",
				label: "Save",
				shortcut: "Ctrl+S",
				onSelect: vi.fn(),
			},
		];
		render(
			<CommandPalette
				commands={commands}
				open={true}
				onClose={vi.fn()}
			/>,
		);

		expect(screen.getByText("Ctrl+S")).toBeVisible();
	});

	it("has search input with placeholder", () => {
		renderPalette({ placeholder: "Search commands..." });

		expect(
			screen.getByPlaceholderText("Search commands..."),
		).toBeVisible();
	});
});
