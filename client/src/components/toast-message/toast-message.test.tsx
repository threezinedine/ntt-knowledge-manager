import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToastMessage } from "./toast-message";

describe("ToastMessage", () => {
	it("renders the title", () => {
		render(<ToastMessage title="Saved" />);

		expect(screen.getByText("Saved")).toBeVisible();
	});

	it("renders the description when provided", () => {
		render(<ToastMessage title="Saved" description="Your changes were saved." />);

		expect(screen.getByText("Your changes were saved.")).toBeVisible();
	});

	it("does not render a description when omitted", () => {
		render(<ToastMessage title="Saved" />);

		const alert = screen.getByRole("alert");
		expect(alert.querySelectorAll("p")).toHaveLength(1);
	});

	it("has role alert", () => {
		render(<ToastMessage title="Saved" />);

		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("defaults to the info variant", () => {
		render(<ToastMessage title="Saved" />);

		expect(screen.getByRole("alert").className).toMatch(/toast--info/);
	});

	it.each(["info", "success", "warn", "error"] as const)(
		"applies the %s variant class",
		(variant) => {
			render(<ToastMessage title="Saved" variant={variant} />);

			expect(screen.getByRole("alert").className).toMatch(
				new RegExp(`toast--${variant}`),
			);
		},
	);

	it("defaults to the bottom-right position", () => {
		render(<ToastMessage title="Saved" />);

		expect(screen.getByRole("alert").className).toMatch(
			/toast--bottom-right/,
		);
	});

	it.each([
		"top-left",
		"top-right",
		"bottom-left",
		"bottom-right",
	] as const)("applies the %s position class", (position) => {
		render(<ToastMessage title="Saved" position={position} />);

		expect(screen.getByRole("alert").className).toMatch(
			new RegExp(`toast--${position}`),
		);
	});

	it("renders a close button when onClose is provided", () => {
		render(<ToastMessage title="Saved" onClose={() => {}} />);

		expect(
			screen.getByRole("button", { name: "Close" }),
		).toBeVisible();
	});

	it("does not render a close button when onClose is omitted", () => {
		render(<ToastMessage title="Saved" />);

		expect(
			screen.queryByRole("button", { name: "Close" }),
		).not.toBeInTheDocument();
	});

	it("calls onClose when the close button is clicked", () => {
		const handleClose = vi.fn();
		render(<ToastMessage title="Saved" onClose={handleClose} />);

		fireEvent.click(screen.getByRole("button", { name: "Close" }));
		expect(handleClose).toHaveBeenCalledOnce();
	});

	it("renders an icon", () => {
		render(<ToastMessage title="Saved" />);

		const icon = screen.getByRole("alert").querySelector("svg[aria-hidden]");
		expect(icon).not.toBeNull();
	});

	it.each(["info", "success", "warn", "error"] as const)(
		"renders an svg icon for the %s variant",
		(variant) => {
			render(<ToastMessage title="Saved" variant={variant} />);

			const icon = screen.getByRole("alert").querySelector("svg[aria-hidden]");
			expect(icon).not.toBeNull();
		},
	);
});
