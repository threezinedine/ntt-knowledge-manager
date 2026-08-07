import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToggleButton } from "./toggle-button";

const TRUE_ICON = "fa-solid fa-thumbtack";
const FALSE_ICON = "fa-regular fa-square";

describe("ToggleButton", () => {
	it("defaults to off", () => {
		render(
			<ToggleButton
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Pin note" }),
		).toHaveAttribute("aria-pressed", "false");
	});

	it("uses defaultValue as the initial value", () => {
		render(
			<ToggleButton
				defaultValue
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Pin note" }),
		).toHaveAttribute("aria-pressed", "true");
	});

	it("keeps its own state across clicks", () => {
		render(
			<ToggleButton
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-pressed", "true");
		fireEvent.click(button);
		expect(button).toHaveAttribute("aria-pressed", "false");
	});

	it("reports value changes through onValueChanged", () => {
		const handleChange = vi.fn();
		render(
			<ToggleButton
				onValueChanged={handleChange}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		fireEvent.click(button);
		expect(handleChange).toHaveBeenCalledWith(true);
		fireEvent.click(button);
		expect(handleChange).toHaveBeenCalledWith(false);
	});

	it("renders the icon for the current internal value", () => {
		render(
			<ToggleButton
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		expect(button.querySelector("i")?.className).toBe(FALSE_ICON);
		fireEvent.click(button);
		expect(button.querySelector("i")?.className).toBe(TRUE_ICON);
	});

	it("shows a spinner and disables the button while loading", () => {
		render(
			<ToggleButton
				isLoading
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-busy", "true");
	});
});
