import styles from "./fields.module.scss";
import type { FieldChangeHandler, FieldProps } from "./types";

type NumberFieldProps = Omit<FieldProps, "defaultValue" | "validate"> & {
	error?: string;
	onChange?: FieldChangeHandler;
	className?: string;
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: number;
	validate?: (value: number | undefined) => string | undefined;
};

export function NumberField({
	className,
	id,
	label,
	hint,
	error,
	min,
	max,
	step,
	defaultValue,
	validate: _validate,
	requiredMessage: _requiredMessage,
	...props
}: NumberFieldProps) {
	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	return (
		<div className={classes}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type="number"
				min={min}
				max={max}
				step={step}
				defaultValue={defaultValue}
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
