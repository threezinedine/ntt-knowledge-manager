import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToggleButton } from "./stateless-toggle-button";

const TRUE_ICON = "fa-solid fa-thumbtack";
const FALSE_ICON = "fa-regular fa-square";

describe("ToggleButton", () => {
	it("defaults to the medium size", () => {
		render(
			<ToggleButton
				value={false}
				onValueChanged={() => {}}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		expect(button.className).toMatch(/toggle--md/);
	});

	it.each(["sm", "md", "lg"] as const)(
		"applies the %s size class",
		(size) => {
			render(
				<ToggleButton
					value={false}
					onValueChanged={() => {}}
					trueIcon={TRUE_ICON}
					falseIcon={FALSE_ICON}
					aria-label="Pin note"
					size={size}
				/>,
			);

			expect(
				screen.getByRole("button", { name: "Pin note" }).className,
			).toMatch(new RegExp(`toggle--${size}`));
		},
	);

	it("reflects an off value through aria-pressed", () => {
		render(
			<ToggleButton
				value={false}
				onValueChanged={() => {}}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		expect(button).toHaveAttribute("aria-pressed", "false");
	});

	it("reflects an on value through aria-pressed", () => {
		render(
			<ToggleButton
				value
				onValueChanged={() => {}}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		expect(button).toHaveAttribute("aria-pressed", "true");
	});

	it("calls onValueChanged with true when toggled on", () => {
		const handleChange = vi.fn();
		render(
			<ToggleButton
				value={false}
				onValueChanged={handleChange}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Pin note" }));
		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it("calls onValueChanged with false when toggled off", () => {
		const handleChange = vi.fn();
		render(
			<ToggleButton
				value
				onValueChanged={handleChange}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Pin note" }));
		expect(handleChange).toHaveBeenCalledWith(false);
	});

	it("shows a spinner and disables the button while loading", () => {
		render(
			<ToggleButton
				value={false}
				onValueChanged={() => {}}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
				isLoading
			/>,
		);

		const button = screen.getByRole("button", { name: "Pin note" });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button.querySelector(`[aria-hidden="true"]`)).not.toBeNull();

		const icon = button.querySelector("i");
		expect(icon?.className).toMatch(/icon--hidden/);
	});

	it("renders the falseIcon when the value is off", () => {
		render(
			<ToggleButton
				value={false}
				onValueChanged={() => {}}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const icon = screen
			.getByRole("button", { name: "Pin note" })
			.querySelector("i");
		expect(icon).not.toBeNull();
		expect(icon?.className).toBe(FALSE_ICON);
	});

	it("renders the trueIcon when the value is on", () => {
		render(
			<ToggleButton
				value
				onValueChanged={() => {}}
				trueIcon={TRUE_ICON}
				falseIcon={FALSE_ICON}
				aria-label="Pin note"
			/>,
		);

		const icon = screen
			.getByRole("button", { name: "Pin note" })
			.querySelector("i");
		expect(icon).not.toBeNull();
		expect(icon?.className).toBe(TRUE_ICON);
	});
});
