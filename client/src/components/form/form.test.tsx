import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "./form";

describe("Form", () => {
	it("renders a form element with the given children", () => {
		const { container } = render(
			<Form aria-label="Contact">
				<input aria-label="Name" />
			</Form>,
		);

		expect(container.querySelector("form")).not.toBeNull();
		expect(
			screen.getByRole("form", { name: "Contact" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", { name: "Name" }),
		).toBeInTheDocument();
	});

	it("renders the title heading when provided", () => {
		render(<Form title="Log in" />);

		expect(
			screen.getByRole("heading", { name: "Log in", level: 2 }),
		).toBeInTheDocument();
	});

	it("does not render a title when omitted", () => {
		const { container } = render(<Form />);

		expect(container.querySelector("h2")).toBeNull();
	});

	it("calls onSubmit when the form is submitted", () => {
		const handleSubmit = vi.fn();
		const { container } = render(<Form onSubmit={handleSubmit} />);

		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(handleSubmit).toHaveBeenCalledOnce();
	});

	it("prevents the default submit behavior", () => {
		const preventDefault = vi.spyOn(Event.prototype, "preventDefault");
		const handleSubmit = vi.fn();
		const { container } = render(<Form onSubmit={handleSubmit} />);

		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(preventDefault).toHaveBeenCalled();
		expect(handleSubmit).toHaveBeenCalledOnce();
		preventDefault.mockRestore();
	});

	it("spreads additional form attributes", () => {
		const { container } = render(<Form noValidate aria-label="F" />);

		expect(container.querySelector("form")).toHaveAttribute("novalidate");
	});

	it("renders text fields from the items prop", () => {
		render(
			<Form
				items={[
					{
						id: "email",
						label: "Email",
						type: "email",
						placeholder: "you@example.com",
					},
					{ id: "name", label: "Name", type: "text" },
				]}
			/>,
		);

		expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
		expect(screen.getByLabelText("Name")).toHaveAttribute("type", "text");
	});

	it("renders textarea and select fields from the items prop", () => {
		render(
			<Form
				items={[
					{
						id: "body",
						label: "Body",
						type: "textarea",
						hint: "Markdown is supported.",
					},
					{
						id: "label",
						label: "Label",
						type: "select",
						options: [
							{ value: "strategy", label: "Strategy" },
							{ value: "engineering", label: "Engineering" },
						],
					},
				]}
			/>,
		);

		expect(screen.getByLabelText("Body").tagName).toBe("TEXTAREA");
		expect(screen.getByLabelText("Label").tagName).toBe("SELECT");
		expect(screen.getAllByRole("option")).toHaveLength(2);
		expect(screen.getByText("Markdown is supported.")).toBeInTheDocument();
	});

	it("does not render any fields when items is omitted", () => {
		const { container } = render(<Form />);

		expect(container.querySelector("input")).toBeNull();
		expect(container.querySelector("textarea")).toBeNull();
		expect(container.querySelector("select")).toBeNull();
	});

	it("does not show errors before the first submit", () => {
		render(
			<Form items={[{ id: "name", label: "Name", required: true }]}>
				<button type="submit">Submit</button>
			</Form>,
		);

		expect(
			screen.queryByText("This field is required."),
		).not.toBeInTheDocument();
	});

	it("shows a required error and does not submit when a required field is empty", () => {
		const handleSubmit = vi.fn();
		const { container } = render(
			<Form
				onSubmit={handleSubmit}
				items={[{ id: "name", label: "Name", required: true }]}
			>
				<button type="submit">Submit</button>
			</Form>,
		);

		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(screen.getByText("This field is required.")).toBeInTheDocument();
		expect(screen.getByLabelText("Name")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		expect(handleSubmit).not.toHaveBeenCalled();
	});

	it("uses the custom requiredMessage", () => {
		const { container } = render(
			<Form
				items={[
					{
						id: "name",
						label: "Name",
						required: true,
						requiredMessage: "Please enter your name.",
					},
				]}
			>
				<button type="submit">Submit</button>
			</Form>,
		);

		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
	});

	it("shows the custom validate error", () => {
		const { container } = render(
			<Form
				items={[
					{
						id: "email",
						label: "Email",
						validate: (value) =>
							value !== "" && !value.includes("@")
								? "Enter a valid email address."
								: undefined,
					},
				]}
			>
				<button type="submit">Submit</button>
			</Form>,
		);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "not-an-email" },
		});
		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(
			screen.getByText("Enter a valid email address."),
		).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	it("calls onSubmit with the field values when valid", () => {
		const handleSubmit = vi.fn();
		const { container } = render(
			<Form
				onSubmit={handleSubmit}
				items={[
					{
						id: "email",
						label: "Email",
						type: "email",
						required: true,
					},
					{ id: "name", label: "Name", type: "text" },
				]}
			>
				<button type="submit">Submit</button>
			</Form>,
		);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "a@b.com" },
		});
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Jane" },
		});
		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(handleSubmit).toHaveBeenCalledWith({
			email: "a@b.com",
			name: "Jane",
		});
	});

	it("clears a field error once the value is fixed", () => {
		const { container } = render(
			<Form items={[{ id: "name", label: "Name", required: true }]}>
				<button type="submit">Submit</button>
			</Form>,
		);

		const form = container.querySelector("form") as HTMLFormElement;
		const input = screen.getByLabelText("Name");

		fireEvent.submit(form);
		expect(screen.getByText("This field is required.")).toBeInTheDocument();

		fireEvent.change(input, { target: { value: "Jane" } });
		expect(
			screen.queryByText("This field is required."),
		).not.toBeInTheDocument();
		expect(input).not.toHaveAttribute("aria-invalid", "true");
	});

	it("validates textarea and select fields", () => {
		const { container } = render(
			<Form
				items={[
					{
						id: "body",
						label: "Body",
						type: "textarea",
						required: true,
					},
					{
						id: "label",
						label: "Label",
						type: "select",
						required: true,
						options: [
							{ value: "", label: "Select a label" },
							{ value: "a", label: "A" },
						],
					},
				]}
			>
				<button type="submit">Submit</button>
			</Form>,
		);

		fireEvent.submit(container.querySelector("form") as HTMLFormElement);

		expect(screen.getAllByText("This field is required.")).toHaveLength(2);
		expect(screen.getByLabelText("Body")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		expect(screen.getByLabelText("Label")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});
});
