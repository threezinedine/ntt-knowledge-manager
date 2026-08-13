import styles from "./fields.module.scss";
import type { SelectOption } from "./types";

type RadioFieldProps = {
	id: string;
	label: string;
	options: SelectOption[];
	defaultValue?: string;
	disabled?: boolean;
	hint?: string;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
};

export function RadioField({
	className,
	id,
	label,
	options,
	defaultValue,
	disabled,
	hint,
	error,
	onChange,
}: RadioFieldProps) {
	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	return (
		<div className={classes} role="radiogroup" aria-labelledby={`${id}-label`}>
			<span id={`${id}-label`}>{label}</span>
			{options.map((option) => (
				<label key={option.value} className={styles.radioOption}>
					<input
						type="radio"
						name={id}
						value={option.value}
						defaultChecked={option.value === defaultValue}
						disabled={disabled}
						aria-describedby={describedBy}
						onChange={() => onChange?.(option.value)}
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
