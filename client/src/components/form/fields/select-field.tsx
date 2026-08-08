import styles from "./fields.module.scss";
import type { FieldChangeHandler, FieldProps, SelectOption } from "./types";

type SelectFieldProps = FieldProps & {
	options: SelectOption[];
	/** Validation error message shown under the field. */
	error?: string;
	onChange?: FieldChangeHandler;
	className?: string;
};

export function SelectField({
	className,
	id,
	label,
	options,
	hint,
	error,
	validate: _validate,
	requiredMessage: _requiredMessage,
	...props
}: SelectFieldProps) {
	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	return (
		<div className={classes}>
			<label htmlFor={id}>{label}</label>
			<select
				id={id}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				{...props}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
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
