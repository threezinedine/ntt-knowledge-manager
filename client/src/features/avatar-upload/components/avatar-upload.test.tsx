import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AvatarUpload } from "./AvatarUpload";

describe("AvatarUpload", () => {
	it("renders the avatar", () => {
		render(<AvatarUpload />);

		expect(screen.getByRole("img", { name: "User avatar" })).toBeVisible();
	});

	it("renders upload badge button", () => {
		render(<AvatarUpload />);

		expect(
			screen.getByRole("button", { name: "Upload avatar" }),
		).toBeVisible();
	});

	it("shows remove button when src is set and onRemove provided", () => {
		render(
			<AvatarUpload
				src="data:image/png;base64,abc"
				onRemove={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Remove avatar" }),
		).toBeVisible();
	});

	it("does not show remove button when no src", () => {
		render(<AvatarUpload onRemove={vi.fn()} />);

		expect(
			screen.queryByRole("button", { name: "Remove avatar" }),
		).not.toBeInTheDocument();
	});

	it("calls onRemove when remove is clicked", () => {
		const onRemove = vi.fn();
		render(
			<AvatarUpload
				src="data:image/png;base64,abc"
				onRemove={onRemove}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Remove avatar" }),
		);

		expect(onRemove).toHaveBeenCalled();
	});

	it("calls onUpload when a file is selected", () => {
		const onUpload = vi.fn();
		render(<AvatarUpload onUpload={onUpload} />);

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const file = new File(["pixels"], "avatar.png", {
			type: "image/png",
		});
		fireEvent.change(input, { target: { files: [file] } });

		expect(onUpload).toHaveBeenCalledWith(file);
	});

	it("accepts only image types", () => {
		render(<AvatarUpload />);

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		expect(input.accept).toBe(
			"image/png,image/jpeg,image/gif,image/webp",
		);
	});

	it("shows placeholder when no src", () => {
		render(<AvatarUpload />);

		expect(screen.getByText("?")).toBeVisible();
	});
});
