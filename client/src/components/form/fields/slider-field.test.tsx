import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SliderField } from "./slider-field";

describe("SliderField", () => {
	it("renders a label and range input", () => {
		render(<SliderField id="vol" label="Volume" />);

		const input = screen.getByLabelText(/Volume/);
		expect(input).toHaveAttribute("type", "range");
	});

	it("sets min, max, and step attributes", () => {
		render(
			<SliderField id="vol" label="Volume" min={0} max={200} step={5} />,
		);

		const input = screen.getByLabelText(/Volume/);
		expect(input).toHaveAttribute("min", "0");
		expect(input).toHaveAttribute("max", "200");
		expect(input).toHaveAttribute("step", "5");
	});

	it("displays the current value in the label", () => {
		render(<SliderField id="vol" label="Volume" defaultValue={42} />);

		expect(screen.getByTestId("vol-value")).toHaveTextContent("42");
	});

	it("updates the displayed value on change", () => {
		render(
			<SliderField id="vol" label="Volume" min={0} max={100} defaultValue={50} />,
		);

		fireEvent.change(screen.getByLabelText(/Volume/), {
			target: { value: "75" },
		});

		expect(screen.getByTestId("vol-value")).toHaveTextContent("75");
	});

	it("calls onChange when the slider moves", () => {
		const handleChange = vi.fn();
		render(
			<SliderField id="vol" label="Volume" onChange={handleChange} />,
		);

		fireEvent.change(screen.getByLabelText(/Volume/), {
			target: { value: "30" },
		});

		expect(handleChange).toHaveBeenCalledOnce();
	});

	it("shows hint text when no error", () => {
		render(
			<SliderField id="vol" label="Volume" hint="Adjust volume" />,
		);

		expect(screen.getByText("Adjust volume")).toBeInTheDocument();
	});

	it("shows error and hides hint when error is present", () => {
		render(
			<SliderField
				id="vol"
				label="Volume"
				hint="Adjust volume"
				error="Out of range"
			/>,
		);

		expect(screen.getByText("Out of range")).toBeInTheDocument();
		expect(screen.queryByText("Adjust volume")).not.toBeInTheDocument();
	});

	it("sets aria-invalid when error is present", () => {
		render(<SliderField id="vol" label="Volume" error="Bad" />);

		expect(screen.getByLabelText(/Volume/)).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	it("renders disabled input", () => {
		render(<SliderField id="vol" label="Volume" disabled />);

		expect(screen.getByLabelText(/Volume/)).toBeDisabled();
	});
});
