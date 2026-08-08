import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Home } from "./home";

describe("Home", () => {
	it("renders the navbar with a login action", () => {
		render(<Home />);

		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Log in" })).toBeVisible();
	});

	it("renders the hero heading, lead, and CTA buttons", () => {
		render(<Home />);

		expect(
			screen.getByRole("heading", {
				name: "Turn scattered notes into decisions",
				level: 1,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(/quiet, dependable home for your notes/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /get started/i }),
		).toBeVisible();
		expect(
			screen.getByRole("button", { name: /browse notes/i }),
		).toBeVisible();
	});

	it("renders the hero image with a descriptive alt", () => {
		render(<Home />);

		expect(
			screen.getByAltText("A preview of the Knowledge workspace"),
		).toBeVisible();
	});

	it("renders the feature cards", () => {
		render(<Home />);

		expect(
			screen.getByRole("heading", { name: "How it works", level: 2 }),
		).toBeInTheDocument();
		for (const title of ["Collect", "Connect", "Decide"]) {
			expect(
				screen.getByRole("heading", { name: title, level: 3 }),
			).toBeInTheDocument();
		}
	});

	it("renders a footer", () => {
		render(<Home />);

		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});
});
