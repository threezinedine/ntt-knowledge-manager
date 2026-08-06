import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
	it("renders its label", () => {
		render(<Button>Save note</Button>);

		expect(screen.getByRole("button", { name: "Save note" })).toBeVisible();
	});

	it("defaults to the primary variant and medium size", () => {
		render(<Button>Save note</Button>);

		const button = screen.getByRole("button", { name: "Save note" });
		expect(button.className).toMatch(/button--primary/);
		expect(button.className).toMatch(/button--md/);
	});

	it.each([
		"primary",
		"secondary",
		"outline",
		"ghost",
		"danger",
		"link",
	] as const)("applies the %s variant class", (variant) => {
		render(<Button variant={variant}>Save note</Button>);

		expect(
			screen.getByRole("button", { name: "Save note" }).className,
		).toMatch(new RegExp(`button--${variant}`));
	});

	it.each(["sm", "md", "lg"] as const)(
		"applies the %s size class",
		(size) => {
			render(<Button size={size}>Save note</Button>);

			expect(
				screen.getByRole("button", { name: "Save note" }).className,
			).toMatch(new RegExp(`button--${size}`));
		},
	);

	it("shows a spinner and disables the button while loading", () => {
		render(<Button isLoading>Save note</Button>);

		const button = screen.getByRole("button", { name: "Save note" });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button.querySelector(`[aria-hidden="true"]`)).not.toBeNull();
	});

	it.each([
		"primary",
		"secondary",
		"outline",
		"ghost",
		"danger",
		"link",
	] as const)("shows the loading state for the %s variant", (variant) => {
		render(
			<Button variant={variant} isLoading>
				Save note
			</Button>,
		);

		const button = screen.getByRole("button", { name: "Save note" });
		expect(button).toBeDisabled();
		expect(button.className).toMatch(/button--loading/);
	});

	it.each(["sm", "md", "lg"] as const)(
		"shows the loading state for the %s size",
		(size) => {
			render(
				<Button size={size} isLoading>
					Save note
				</Button>,
			);

			const button = screen.getByRole("button", { name: "Save note" });
			expect(button).toBeDisabled();
			expect(button.className).toMatch(/button--loading/);
		},
	);
});
