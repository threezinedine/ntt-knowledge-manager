import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

	describe("progress bar", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("renders a progress bar when duration is set", () => {
			render(<ToastMessage title="Saved" duration={3000} onClose={() => {}} />);

			expect(screen.getByTestId("toast-progress")).toBeInTheDocument();
		});

		it("does not render a progress bar when duration is omitted", () => {
			render(<ToastMessage title="Saved" onClose={() => {}} />);

			expect(screen.queryByTestId("toast-progress")).not.toBeInTheDocument();
		});

		it("sets animation duration from the duration prop", () => {
			render(<ToastMessage title="Saved" duration={5000} onClose={() => {}} />);

			const bar = screen.getByTestId("toast-progress");
			expect(bar.style.animationDuration).toBe("5000ms");
		});

		it("calls onClose after the duration elapses", () => {
			const handleClose = vi.fn();
			render(<ToastMessage title="Saved" duration={3000} onClose={handleClose} />);

			expect(handleClose).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(3000);
			});

			expect(handleClose).toHaveBeenCalledOnce();
		});

		it("does not call onClose before the duration elapses", () => {
			const handleClose = vi.fn();
			render(<ToastMessage title="Saved" duration={3000} onClose={handleClose} />);

			act(() => {
				vi.advanceTimersByTime(2000);
			});

			expect(handleClose).not.toHaveBeenCalled();
		});
	});
});
