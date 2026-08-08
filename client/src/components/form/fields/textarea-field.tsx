import styles from "./fields.module.scss";
import type { FieldChangeHandler, FieldProps } from "./types";

type TextareaFieldProps = FieldProps & {
	/** Validation error message shown under the field. */
	error?: string;
	onChange?: FieldChangeHandler;
	className?: string;
};

export function TextareaField({
	className,
	id,
	label,
	hint,
	error,
	validate: _validate,
	requiredMessage: _requiredMessage,
	...props
}: TextareaFieldProps) {
	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	return (
		<div className={classes}>
			<label htmlFor={id}>{label}</label>
			<textarea
				id={id}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				{...props}
			/>
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
