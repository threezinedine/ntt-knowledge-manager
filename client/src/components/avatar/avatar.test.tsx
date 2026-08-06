import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

const PNG_URL = "/images/user.png";
const BASE64_IMAGE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

describe("Avatar", () => {
	it("renders an image with the given alt text", () => {
		render(<Avatar src={PNG_URL} alt="Jane Doe" />);

		expect(screen.getByRole("img", { name: "Jane Doe" })).toBeVisible();
	});

	it("defaults to the medium size", () => {
		render(<Avatar src={PNG_URL} alt="Jane Doe" />);

		const wrapper = screen.getByRole("img", { name: "Jane Doe" })
			.parentElement as HTMLElement;
		expect(wrapper.className).toMatch(/avatar--md/);
	});

	it.each(["sm", "md", "lg"] as const)(
		"applies the %s size class",
		(size) => {
			render(<Avatar src={PNG_URL} alt="Jane Doe" size={size} />);

			const wrapper = screen.getByRole("img", { name: "Jane Doe" })
				.parentElement as HTMLElement;
			expect(wrapper.className).toMatch(new RegExp(`avatar--${size}`));
		},
	);

	it("renders a base64 image source", () => {
		render(<Avatar src={BASE64_IMAGE} alt="Jane Doe" />);

		expect(screen.getByRole("img", { name: "Jane Doe" })).toHaveAttribute(
			"src",
			BASE64_IMAGE,
		);
	});

	it("renders a png url image source", () => {
		render(<Avatar src={PNG_URL} alt="Jane Doe" />);

		expect(screen.getByRole("img", { name: "Jane Doe" })).toHaveAttribute(
			"src",
			PNG_URL,
		);
	});

	it("renders a letter fallback when no src is given", () => {
		render(<Avatar alt="Jane Doe">J</Avatar>);

		const avatar = screen.getByRole("img", { name: "Jane Doe" });
		expect(avatar).toBeVisible();
		expect(avatar).toHaveTextContent("J");
		expect(avatar.querySelector("img")).toBeNull();
	});
});
