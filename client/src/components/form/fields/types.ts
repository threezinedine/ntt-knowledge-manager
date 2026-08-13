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

export type NumberFieldDefinition = Omit<FieldProps, "defaultValue" | "validate"> & {
	type: "number";
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: number;
	validate?: (value: number | undefined) => string | undefined;
};

export type SliderFieldDefinition = Omit<FieldProps, "defaultValue" | "validate" | "placeholder"> & {
	type: "slider";
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: number;
};

export type RadioFieldDefinition = Omit<FieldProps, "placeholder" | "validate"> & {
	type: "radio";
	options: SelectOption[];
};

export type MultiSelectFieldDefinition = Omit<FieldProps, "defaultValue" | "placeholder" | "validate"> & {
	type: "multiselect";
	options: SelectOption[];
	defaultValue?: string[];
};

export type ComboboxFieldDefinition = Omit<FieldProps, "validate"> & {
	type: "combobox";
	options: SelectOption[];
};

export type SelectFieldDefinition = FieldProps & {
	type: "select";
	options: SelectOption[];
};

export type FormField =
	| TextFieldDefinition
	| TextareaFieldDefinition
	| NumberFieldDefinition
	| SliderFieldDefinition
	| RadioFieldDefinition
	| MultiSelectFieldDefinition
	| ComboboxFieldDefinition
	| SelectFieldDefinition;
