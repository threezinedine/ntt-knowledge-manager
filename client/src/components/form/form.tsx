import { useState } from "react";
import type { FormEvent, FormHTMLAttributes } from "react";
import { TextField, TextareaField, NumberField, SelectField } from "./fields";
import type { FieldChangeEvent, FormField } from "./fields";
import styles from "./form.module.scss";

type FormProps = Omit<
	FormHTMLAttributes<HTMLFormElement>,
	// "title" is a native attribute (tooltip) that must be omitted before
	// overriding it with the visible heading text.
	"onSubmit" | "title"
> & {
	/** Heading shown above the fields. */
	title?: string;
	/** Field definitions rendered inside the form. */
	items?: FormField[];
	/** Called with the field values when the form validates and submits. */
	onSubmit?: (values: Record<string, string>) => void;
};

function validateField(field: FormField, value: string): string | undefined {
	if (field.required && value.trim() === "") {
		return field.requiredMessage ?? "This field is required.";
	}
	return field.validate?.(value);
}

function readFieldValue(form: HTMLFormElement, id: string): string {
	const element = form.elements.namedItem(id);
	if (
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		element instanceof HTMLSelectElement
	) {
		return element.value;
	}
	return "";
}

export function Form({
	className,
	title,
	items = [],
	onSubmit,
	children,
	...props
}: FormProps) {
	const [errors, setErrors] = useState<Record<string, string | undefined>>(
		{},
	);
	const [attempted, setAttempted] = useState(false);
	const classes = [styles.form, className].filter(Boolean).join(" ");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAttempted(true);

		const form = event.currentTarget;
		const values: Record<string, string> = {};
		const nextErrors: Record<string, string | undefined> = {};
		let hasError = false;

		for (const field of items) {
			const value = readFieldValue(form, field.id);
			values[field.id] = value;
			const error = validateField(field, value);
			if (error) {
				hasError = true;
			}
			nextErrors[field.id] = error;
		}

		setErrors(nextErrors);
		if (!hasError) {
			onSubmit?.(values);
		}
	};

	const handleFieldChange =
		(field: FormField) => (event: FieldChangeEvent) => {
			if (!attempted) {
				return;
			}
			// capture the value now: React nulls event.currentTarget before
			// the async state updater runs
			const value = event.currentTarget.value;
			setErrors((prev) => ({
				...prev,
				[field.id]: validateField(field, value),
			}));
		};

	return (
		<form
			className={classes}
			noValidate={items.length > 0}
			onSubmit={handleSubmit}
			{...props}
		>
			{title && <h2 className={styles.title}>{title}</h2>}
			{items.map((field) => {
				switch (field.type) {
					case "textarea": {
						const { type: _type, ...rest } = field;
						return (
							<TextareaField
								key={field.id}
								{...rest}
								error={errors[field.id]}
								onChange={handleFieldChange(field)}
							/>
						);
					}
					case "number": {
						const { type: _type, ...rest } = field;
						return (
							<NumberField
								key={field.id}
								{...rest}
								error={errors[field.id]}
								onChange={handleFieldChange(field)}
							/>
						);
					}
					case "select": {
						const { type: _type, ...rest } = field;
						return (
							<SelectField
								key={field.id}
								{...rest}
								error={errors[field.id]}
								onChange={handleFieldChange(field)}
							/>
						);
					}
					default:
						return (
							<TextField
								key={field.id}
								{...field}
								error={errors[field.id]}
								onChange={handleFieldChange(field)}
							/>
						);
				}
			})}
			{children}
		</form>
	);
}
