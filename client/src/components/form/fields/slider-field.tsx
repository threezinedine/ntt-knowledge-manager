import { useState } from "react";
import styles from "./fields.module.scss";
import type { FieldChangeHandler, FieldProps } from "./types";

type SliderFieldProps = Omit<FieldProps, "defaultValue" | "validate" | "placeholder"> & {
	error?: string;
	onChange?: FieldChangeHandler;
	className?: string;
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: number;
};

export function SliderField({
	className,
	id,
	label,
	hint,
	error,
	min = 0,
	max = 100,
	step = 1,
	defaultValue = 0,
	validate: _validate,
	requiredMessage: _requiredMessage,
	onChange,
	...props
}: SliderFieldProps) {
	const [displayValue, setDisplayValue] = useState(defaultValue);
	const classes = [styles.field, className].filter(Boolean).join(" ");
	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

	return (
		<div className={classes}>
			<label htmlFor={id}>
				{label}: <span data-testid={`${id}-value`}>{displayValue}</span>
			</label>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				defaultValue={defaultValue}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				onChange={(e) => {
					setDisplayValue(Number(e.target.value));
					onChange?.(e);
				}}
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
