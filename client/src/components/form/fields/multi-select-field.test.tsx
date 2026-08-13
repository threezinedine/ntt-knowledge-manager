import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MultiSelectField } from "./multi-select-field";

const OPTIONS = [
	{ value: "red", label: "Red" },
	{ value: "green", label: "Green" },
	{ value: "blue", label: "Blue" },
];

describe("MultiSelectField", () => {
	it("renders a group with label and checkboxes", () => {
		render(<MultiSelectField id="colors" label="Colors" options={OPTIONS} />);

		expect(screen.getByRole("group")).toBeInTheDocument();
		expect(screen.getByText("Colors")).toBeInTheDocument();
		expect(screen.getAllByRole("checkbox")).toHaveLength(3);
	});

	it("renders option labels", () => {
		render(<MultiSelectField id="colors" label="Colors" options={OPTIONS} />);

		expect(screen.getByText("Red")).toBeInTheDocument();
		expect(screen.getByText("Green")).toBeInTheDocument();
		expect(screen.getByText("Blue")).toBeInTheDocument();
	});

	it("checks default values", () => {
		render(
			<MultiSelectField
				id="colors"
				label="Colors"
				options={OPTIONS}
				defaultValue={["red", "blue"]}
			/>,
		);

		const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
		expect(checkboxes[0].checked).toBe(true);
		expect(checkboxes[1].checked).toBe(false);
		expect(checkboxes[2].checked).toBe(true);
	});

	it("calls onChange with checked values", () => {
		const handleChange = vi.fn();
		render(
			<MultiSelectField
				id="colors"
				label="Colors"
				options={OPTIONS}
				onChange={handleChange}
			/>,
		);

		fireEvent.click(screen.getByText("Green"));

		expect(handleChange).toHaveBeenCalledWith(
			expect.arrayContaining(["green"]),
		);
	});

	it("shows hint text when no error", () => {
		render(
			<MultiSelectField
				id="colors"
				label="Colors"
				options={OPTIONS}
				hint="Select colors"
			/>,
		);

		expect(screen.getByText("Select colors")).toBeInTheDocument();
	});

	it("shows error and hides hint", () => {
		render(
			<MultiSelectField
				id="colors"
				label="Colors"
				options={OPTIONS}
				hint="Select colors"
				error="Pick at least one"
			/>,
		);

		expect(screen.getByText("Pick at least one")).toBeInTheDocument();
		expect(screen.queryByText("Select colors")).not.toBeInTheDocument();
	});

	it("disables all checkboxes when disabled", () => {
		render(
			<MultiSelectField
				id="colors"
				label="Colors"
				options={OPTIONS}
				disabled
			/>,
		);

		for (const checkbox of screen.getAllByRole("checkbox")) {
			expect(checkbox).toBeDisabled();
		}
	});
});
