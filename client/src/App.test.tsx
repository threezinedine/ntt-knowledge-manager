import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
	it("shows the selected note in the editor", () => {
		render(<App />);

		fireEvent.click(
			screen.getByRole("button", { name: /database patterns/i }),
		);

		expect(
			screen.getByRole("heading", {
				name: "Database patterns",
				level: 2,
			}),
		).toBeInTheDocument();
	});
});
