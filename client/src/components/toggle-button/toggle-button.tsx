import { useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { ToggleButton as StatelessToggleButton } from "../stateless-toggle-button";
import type { Size } from "../common";

type ToggleButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	// "defaultValue" is a native button attribute (string | number | string[])
	// that must be omitted before overriding it with a boolean.
	"onClick" | "value" | "children" | "defaultValue"
> & {
	/** Initial value; the component keeps its own state afterwards. */
	defaultValue?: boolean;
	onValueChanged?: (value: boolean) => void;
	size?: Size;
	isLoading?: boolean;
	/** Font Awesome class(es) shown when value is true, e.g. "fa-solid fa-toggle-on". */
	trueIcon: string;
	/** Font Awesome class(es) shown when value is false, e.g. "fa-solid fa-toggle-off". */
	falseIcon: string;
};

export function ToggleButton({
	defaultValue = false,
	onValueChanged,
	...props
}: ToggleButtonProps) {
	const [value, setValue] = useState(defaultValue);

	return (
		<StatelessToggleButton
			value={value}
			onValueChanged={(next) => {
				setValue(next);
				onValueChanged?.(next);
			}}
			{...props}
		/>
	);
}
