import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal, type ModalRef } from "./modal";

function renderModal(props = {}) {
	const ref = createRef<ModalRef>();
	const result = render(
		<Modal ref={ref} {...props}>
			<p>Modal content</p>
		</Modal>,
	);
	return { ref, ...result };
}

describe("Modal", () => {
	it("does not render children when closed", () => {
		renderModal();

		expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders children when opened via ref", () => {
		const { ref } = renderModal();

		act(() => ref.current!.open());

		expect(screen.getByText("Modal content")).toBeVisible();
		expect(screen.getByRole("dialog")).toBeVisible();
	});

	it("closes when close is called via ref", () => {
		const { ref } = renderModal();

		act(() => ref.current!.open());
		expect(screen.getByRole("dialog")).toBeVisible();

		act(() => ref.current!.close());
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("closes when the backdrop is clicked", () => {
		const { ref } = renderModal();

		act(() => ref.current!.open());
		fireEvent.pointerDown(screen.getByRole("dialog"));

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("does not close when content area is clicked", () => {
		const { ref } = renderModal();

		act(() => ref.current!.open());
		fireEvent.pointerDown(screen.getByText("Modal content"));

		expect(screen.getByRole("dialog")).toBeVisible();
	});

	it("closes when Escape key is pressed", () => {
		const { ref } = renderModal();

		act(() => ref.current!.open());
		expect(screen.getByRole("dialog")).toBeVisible();

		fireEvent.keyDown(document, { key: "Escape" });

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("calls onClose when closed via ref", () => {
		const handleClose = vi.fn();
		const { ref } = renderModal({ onClose: handleClose });

		act(() => ref.current!.open());
		act(() => ref.current!.close());

		expect(handleClose).toHaveBeenCalledOnce();
	});

	it("calls onClose when backdrop is clicked", () => {
		const handleClose = vi.fn();
		const { ref } = renderModal({ onClose: handleClose });

		act(() => ref.current!.open());
		fireEvent.pointerDown(screen.getByRole("dialog"));

		expect(handleClose).toHaveBeenCalledOnce();
	});

	it("calls onClose when Escape is pressed", () => {
		const handleClose = vi.fn();
		const { ref } = renderModal({ onClose: handleClose });

		act(() => ref.current!.open());
		fireEvent.keyDown(document, { key: "Escape" });

		expect(handleClose).toHaveBeenCalledOnce();
	});

	it("has aria-modal attribute", () => {
		const { ref } = renderModal();

		act(() => ref.current!.open());

		expect(screen.getByRole("dialog")).toHaveAttribute(
			"aria-modal",
			"true",
		);
	});
});
