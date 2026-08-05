import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
	it("renders its label", () => {
		render(<Button>Save note</Button>);

		expect(screen.getByRole("button", { name: "Save note" })).toBeVisible();
	});
});
