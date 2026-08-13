import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadioField } from "./radio-field";

const OPTIONS = [
	{ value: "sm", label: "Small" },
	{ value: "md", label: "Medium" },
	{ value: "lg", label: "Large" },
];

describe("RadioField", () => {
	it("renders a radiogroup with label and options", () => {
		render(<RadioField id="size" label="Size" options={OPTIONS} />);

		expect(screen.getByRole("radiogroup")).toBeInTheDocument();
		expect(screen.getByText("Size")).toBeInTheDocument();
		expect(screen.getAllByRole("radio")).toHaveLength(3);
	});

	it("renders option labels", () => {
		render(<RadioField id="size" label="Size" options={OPTIONS} />);

		expect(screen.getByText("Small")).toBeInTheDocument();
		expect(screen.getByText("Medium")).toBeInTheDocument();
		expect(screen.getByText("Large")).toBeInTheDocument();
	});

	it("checks the default value", () => {
		render(
			<RadioField id="size" label="Size" options={OPTIONS} defaultValue="md" />,
		);

		const radios = screen.getAllByRole("radio") as HTMLInputElement[];
		expect(radios[0].checked).toBe(false);
		expect(radios[1].checked).toBe(true);
		expect(radios[2].checked).toBe(false);
	});

	it("calls onChange with the selected value", () => {
		const handleChange = vi.fn();
		render(
			<RadioField id="size" label="Size" options={OPTIONS} onChange={handleChange} />,
		);

		fireEvent.click(screen.getByText("Large"));

		expect(handleChange).toHaveBeenCalledWith("lg");
	});

	it("shows hint text when no error", () => {
		render(
			<RadioField id="size" label="Size" options={OPTIONS} hint="Pick one" />,
		);

		expect(screen.getByText("Pick one")).toBeInTheDocument();
	});

	it("shows error and hides hint", () => {
		render(
			<RadioField
				id="size"
				label="Size"
				options={OPTIONS}
				hint="Pick one"
				error="Required"
			/>,
		);

		expect(screen.getByText("Required")).toBeInTheDocument();
		expect(screen.queryByText("Pick one")).not.toBeInTheDocument();
	});

	it("disables all radios when disabled", () => {
		render(
			<RadioField id="size" label="Size" options={OPTIONS} disabled />,
		);

		for (const radio of screen.getAllByRole("radio")) {
			expect(radio).toBeDisabled();
		}
	});
});
