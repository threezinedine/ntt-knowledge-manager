import type { ChangeEvent } from "react";

export type TextInputType =
	| "text"
	| "email"
	| "password"
	| "search"
	| "url"
	| "tel"
	| "number";

export type SelectOption = {
	value: string;
	label: string;
};

/** Change event shared by every field control. */
export type FieldChangeEvent = ChangeEvent<
	HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

/** Change handler accepted by every field control. */
export type FieldChangeHandler = (event: FieldChangeEvent) => void;

/** Shared props for every field (both definitions and field controls). */
export type FieldProps = {
	/** Stable id, also used as the input id. */
	id: string;
	/** Label shown above the field. */
	label: string;
	/** Placeholder text shown while the field is empty. */
	placeholder?: string;
	/** Marks the field as required for native validation. */
	required?: boolean;
	disabled?: boolean;
	/** Initial value. */
	defaultValue?: string;
	/** Accessible helper text shown under the field. */
	hint?: string;
	/** Custom validation rule; return an error message or `undefined` when valid. */
	validate?: (value: string) => string | undefined;
	/** Message shown when a required field is empty. */
	requiredMessage?: string;
};

/** Definition passed to `Form` via its `items` prop. */
export type TextFieldDefinition = FieldProps & {
	type?: TextInputType;
};

export type TextareaFieldDefinition = FieldProps & {
	type: "textarea";
};

export type SelectFieldDefinition = FieldProps & {
	type: "select";
	options: SelectOption[];
};

export type FormField =
	| TextFieldDefinition
	| TextareaFieldDefinition
	| SelectFieldDefinition;
