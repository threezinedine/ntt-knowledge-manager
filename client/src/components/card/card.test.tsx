import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./card";

const PNG_URL = "/images/user.png";

const LONG_DESCRIPTION =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

describe("Card", () => {
	it("renders the title and description", () => {
		render(
			<Card
				title="Database patterns"
				description="Seed data and migration notes."
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "Database patterns" }),
		).toBeInTheDocument();
		expect(
			screen.getByText("Seed data and migration notes."),
		).toBeInTheDocument();
	});

	it("renders the avatar image when a src is provided", () => {
		render(
			<Card
				title="Database patterns"
				avatarSrc={PNG_URL}
				avatarAlt="Jane"
			/>,
		);

		const avatar = screen.getByRole("img", { name: "Jane" });
		expect(avatar).toBeVisible();
		expect(avatar).toHaveAttribute("src", PNG_URL);
	});

	it("renders a placeholder avatar with the title initial when no src is given", () => {
		render(<Card title="Database patterns" avatarAlt="Note avatar" />);

		const avatar = screen.getByRole("img", { name: "Note avatar" });
		expect(avatar).toBeVisible();
		expect(avatar).toHaveTextContent("D");
	});

	it("renders the provided fallback in the placeholder avatar", () => {
		render(
			<Card
				title="Database patterns"
				avatarAlt="Note avatar"
				avatarFallback="DB"
			/>,
		);

		expect(
			screen.getByRole("img", { name: "Note avatar" }),
		).toHaveTextContent("DB");
	});

	it("keeps a short description as-is", () => {
		render(<Card title="T" description="Short description" />);

		expect(screen.getByText("Short description")).toBeInTheDocument();
	});

	it("truncates a long description with an ellipsis", () => {
		render(
			<Card
				title="T"
				description={LONG_DESCRIPTION}
				descriptionMaxLength={20}
			/>,
		);

		expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
	});

	it("respects descriptionMaxLength when truncating", () => {
		render(
			<Card
				title="T"
				description="This is a fairly long description"
				descriptionMaxLength={10}
			/>,
		);

		const paragraph = screen.getByText(/\.\.\.$/);
		expect(paragraph.textContent).toBe("This is a...");
	});

	it("does not render a description paragraph when omitted", () => {
		render(<Card title="T" />);

		expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
	});

	it("is not interactive when no onClick is provided", () => {
		render(<Card title="T" />);

		const card = screen
			.getByRole("heading", { name: "T" })
			.closest("article") as HTMLElement;
		expect(card).not.toHaveAttribute("role");
		expect(card).not.toHaveAttribute("tabindex");
	});

	it("marks the card as clickable when onClick is provided", () => {
		render(<Card title="T" onClick={() => {}} />);

		const card = screen
			.getByRole("heading", { name: "T" })
			.closest("article") as HTMLElement;
		expect(card).toHaveAttribute("role", "button");
		expect(card).toHaveAttribute("tabindex", "0");
	});

	it("calls onClick when the card is clicked", () => {
		const handleClick = vi.fn();
		render(<Card title="T" onClick={handleClick} />);

		const card = screen
			.getByRole("heading", { name: "T" })
			.closest("article") as HTMLElement;
		fireEvent.click(card);
		expect(handleClick).toHaveBeenCalledOnce();
	});

	it("activates the card with the Enter key", () => {
		const handleClick = vi.fn();
		render(<Card title="T" onClick={handleClick} />);

		const card = screen
			.getByRole("heading", { name: "T" })
			.closest("article") as HTMLElement;
		fireEvent.keyDown(card, { key: "Enter" });
		expect(handleClick).toHaveBeenCalledOnce();
	});

	it("activates the card with the Space key", () => {
		const handleClick = vi.fn();
		render(<Card title="T" onClick={handleClick} />);

		const card = screen
			.getByRole("heading", { name: "T" })
			.closest("article") as HTMLElement;
		fireEvent.keyDown(card, { key: " " });
		expect(handleClick).toHaveBeenCalledOnce();
	});
});
