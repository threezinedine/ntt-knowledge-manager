import styles from "./fields.module.scss";
import type { SelectOption } from "./types";

type MultiSelectFieldProps = {
	id: string;
	label: string;
	options: SelectOption[];
	defaultValue?: string[];
	disabled?: boolean;
	hint?: string;
	error?: string;
	onChange?: (values: string[]) => void;
	className?: string;
};

export function MultiSelectField({
	className,
	id,
	label,
	options,
	defaultValue = [],
	disabled,
	hint,
	error,
	onChange,
}: MultiSelectFieldProps) {
	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	const handleChange = (optionValue: string, checked: boolean) => {
		if (!onChange) return;
		const current = Array.from(
			document.querySelectorAll<HTMLInputElement>(`input[name="${id}"]:checked`),
		).map((el) => el.value);
		if (checked && !current.includes(optionValue)) {
			current.push(optionValue);
		} else if (!checked) {
			const idx = current.indexOf(optionValue);
			if (idx !== -1) current.splice(idx, 1);
		}
		onChange(current);
	};

	return (
		<div className={classes} role="group" aria-labelledby={`${id}-label`}>
			<span id={`${id}-label`}>{label}</span>
			{options.map((option) => (
				<label key={option.value} className={styles.checkboxOption}>
					<input
						type="checkbox"
						name={id}
						value={option.value}
						defaultChecked={defaultValue.includes(option.value)}
						disabled={disabled}
						aria-describedby={describedBy}
						onChange={(e) => handleChange(option.value, e.target.checked)}
					/>
					{option.label}
				</label>
			))}
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
