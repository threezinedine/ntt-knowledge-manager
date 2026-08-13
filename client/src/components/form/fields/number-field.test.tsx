import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NumberField } from "./number-field";

describe("NumberField", () => {
	it("renders a label and number input", () => {
		render(<NumberField id="qty" label="Quantity" />);

		const input = screen.getByLabelText("Quantity");
		expect(input).toHaveAttribute("type", "number");
	});

	it("sets min, max, and step attributes", () => {
		render(
			<NumberField id="age" label="Age" min={0} max={120} step={1} />,
		);

		const input = screen.getByLabelText("Age");
		expect(input).toHaveAttribute("min", "0");
		expect(input).toHaveAttribute("max", "120");
		expect(input).toHaveAttribute("step", "1");
	});

	it("renders the default value", () => {
		render(<NumberField id="qty" label="Quantity" defaultValue={5} />);

		expect(screen.getByLabelText("Quantity")).toHaveValue(5);
	});

	it("shows hint text when no error", () => {
		render(
			<NumberField id="qty" label="Quantity" hint="Enter a number" />,
		);

		expect(screen.getByText("Enter a number")).toBeInTheDocument();
	});

	it("shows error and hides hint when error is present", () => {
		render(
			<NumberField
				id="qty"
				label="Quantity"
				hint="Enter a number"
				error="Too large"
			/>,
		);

		expect(screen.getByText("Too large")).toBeInTheDocument();
		expect(screen.queryByText("Enter a number")).not.toBeInTheDocument();
	});

	it("sets aria-invalid when error is present", () => {
		render(
			<NumberField id="qty" label="Quantity" error="Required" />,
		);

		expect(screen.getByLabelText("Quantity")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	it("does not set aria-invalid when there is no error", () => {
		render(<NumberField id="qty" label="Quantity" />);

		expect(screen.getByLabelText("Quantity")).not.toHaveAttribute(
			"aria-invalid",
		);
	});

	it("sets aria-describedby to hint id when hint is provided", () => {
		render(
			<NumberField id="qty" label="Quantity" hint="Some hint" />,
		);

		expect(screen.getByLabelText("Quantity")).toHaveAttribute(
			"aria-describedby",
			"qty-hint",
		);
	});

	it("sets aria-describedby to error id when error is provided", () => {
		render(
			<NumberField id="qty" label="Quantity" error="Bad" hint="Some hint" />,
		);

		expect(screen.getByLabelText("Quantity")).toHaveAttribute(
			"aria-describedby",
			"qty-error",
		);
	});

	it("renders disabled input", () => {
		render(<NumberField id="qty" label="Quantity" disabled />);

		expect(screen.getByLabelText("Quantity")).toBeDisabled();
	});
});
