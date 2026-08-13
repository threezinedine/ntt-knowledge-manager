import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ComboboxField } from "./combobox-field";

const OPTIONS = [
	{ value: "us", label: "United States" },
	{ value: "uk", label: "United Kingdom" },
	{ value: "de", label: "Germany" },
	{ value: "fr", label: "France" },
];

describe("ComboboxField", () => {
	it("renders a label and combobox input", () => {
		render(<ComboboxField id="country" label="Country" options={OPTIONS} />);

		expect(screen.getByLabelText("Country")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("shows the default value label in the input", () => {
		render(
			<ComboboxField
				id="country"
				label="Country"
				options={OPTIONS}
				defaultValue="de"
			/>,
		);

		expect(screen.getByRole("combobox")).toHaveValue("Germany");
	});

	it("shows filtered options on typing", () => {
		render(<ComboboxField id="country" label="Country" options={OPTIONS} />);

		const input = screen.getByRole("combobox");
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: "United" } });

		expect(screen.getByText("United States")).toBeInTheDocument();
		expect(screen.getByText("United Kingdom")).toBeInTheDocument();
		expect(screen.queryByText("Germany")).not.toBeInTheDocument();
		expect(screen.queryByText("France")).not.toBeInTheDocument();
	});

	it("shows all options when focused with empty input", () => {
		render(<ComboboxField id="country" label="Country" options={OPTIONS} />);

		fireEvent.focus(screen.getByRole("combobox"));

		expect(screen.getAllByRole("option")).toHaveLength(4);
	});

	it("selects an option on click", () => {
		const handleChange = vi.fn();
		render(
			<ComboboxField
				id="country"
				label="Country"
				options={OPTIONS}
				onChange={handleChange}
			/>,
		);

		fireEvent.focus(screen.getByRole("combobox"));
		fireEvent.click(screen.getByText("France"));

		expect(handleChange).toHaveBeenCalledWith("fr");
		expect(screen.getByRole("combobox")).toHaveValue("France");
	});

	it("shows hint text when no error", () => {
		render(
			<ComboboxField
				id="country"
				label="Country"
				options={OPTIONS}
				hint="Type to search"
			/>,
		);

		expect(screen.getByText("Type to search")).toBeInTheDocument();
	});

	it("shows error and hides hint", () => {
		render(
			<ComboboxField
				id="country"
				label="Country"
				options={OPTIONS}
				hint="Type to search"
				error="Required"
			/>,
		);

		expect(screen.getByText("Required")).toBeInTheDocument();
		expect(screen.queryByText("Type to search")).not.toBeInTheDocument();
	});

	it("sets aria-invalid when error is present", () => {
		render(
			<ComboboxField
				id="country"
				label="Country"
				options={OPTIONS}
				error="Required"
			/>,
		);

		expect(screen.getByRole("combobox")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	it("disables the input when disabled", () => {
		render(
			<ComboboxField
				id="country"
				label="Country"
				options={OPTIONS}
				disabled
			/>,
		);

		expect(screen.getByRole("combobox")).toBeDisabled();
	});
});
