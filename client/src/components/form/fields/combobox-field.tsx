import { useState, useRef } from "react";
import styles from "./fields.module.scss";
import type { SelectOption } from "./types";

type ComboboxFieldProps = {
	id: string;
	label: string;
	options: SelectOption[];
	defaultValue?: string;
	placeholder?: string;
	disabled?: boolean;
	hint?: string;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
};

export function ComboboxField({
	className,
	id,
	label,
	options,
	defaultValue = "",
	placeholder,
	disabled,
	hint,
	error,
	onChange,
}: ComboboxFieldProps) {
	const defaultLabel = options.find((o) => o.value === defaultValue)?.label ?? "";
	const [query, setQuery] = useState(defaultLabel);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState(defaultValue);
	const inputRef = useRef<HTMLInputElement>(null);

	const filtered = options.filter((o) =>
		o.label.toLowerCase().includes(query.toLowerCase()),
	);

	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
	const listboxId = `${id}-listbox`;

	const selectOption = (option: SelectOption) => {
		setQuery(option.label);
		setSelectedValue(option.value);
		setIsOpen(false);
		onChange?.(option.value);
	};

	return (
		<div className={classes}>
			<label htmlFor={id}>{label}</label>
			<input type="hidden" name={id} value={selectedValue} />
			<div style={{ position: "relative" }}>
				<input
					id={id}
					type="text"
					role="combobox"
					aria-expanded={isOpen}
					aria-controls={listboxId}
					aria-autocomplete="list"
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					placeholder={placeholder}
					disabled={disabled}
					ref={inputRef}
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setSelectedValue("");
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					onBlur={() => {
						setTimeout(() => setIsOpen(false), 150);
					}}
				/>
				{isOpen && filtered.length > 0 && (
					<ul
						id={listboxId}
						role="listbox"
						className={styles.comboboxDropdown}
					>
						{filtered.map((option) => (
							<li
								key={option.value}
								role="option"
								aria-selected={option.value === selectedValue}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => selectOption(option)}
								className={styles.comboboxOption}
							>
								{option.label}
							</li>
						))}
					</ul>
				)}
			</div>
			{hint && !error && (
				<p id={`${id}-hint`} className={styles.hint}>
					{hint}
				</p>
			)}
			{error && (
				<p id={`${id}-error`} className={styles.error}>
					{error}
				</p>
			)}
		</div>
	);
}
