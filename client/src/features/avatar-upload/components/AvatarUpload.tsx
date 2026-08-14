import { useRef } from "react";
import { Avatar } from "../../../components";
import type { Size } from "../../../components/common";
import styles from "./avatar-upload.module.scss";

type AvatarUploadProps = {
	src?: string;
	size?: Size;
	loading?: boolean;
	onUpload?: (file: File) => void;
	onRemove?: () => void;
};

const ACCEPT = "image/png,image/jpeg,image/gif,image/webp";

function CameraIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5 2L4 3.5H2.5C1.67 3.5 1 4.17 1 5V11C1 11.83 1.67 12.5 2.5 12.5H11.5C12.33 12.5 13 11.83 13 11V5C13 4.17 12.33 3.5 11.5 3.5H10L9 2H5Z"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinejoin="round"
			/>
			<circle
				cx="7"
				cy="7.75"
				r="2.25"
				stroke="currentColor"
				strokeWidth="1.2"
			/>
		</svg>
	);
}

export function AvatarUpload({
	src,
	size = "lg",
	loading = false,
	onUpload,
	onRemove,
}: AvatarUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleChange = () => {
		const file = inputRef.current?.files?.[0];
		if (file) {
			onUpload?.(file);
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	return (
		<div className={styles.wrapper}>
			<Avatar
				size={size}
				src={src || undefined}
				alt="User avatar"
				isLoading={loading}
				onClick={handleClick}
			>
				{!src && !loading ? "?" : null}
			</Avatar>
			<button
				className={styles.badge}
				onClick={handleClick}
				aria-label="Upload avatar"
				type="button"
			>
				<CameraIcon />
			</button>
			{src && onRemove && (
				<button
					className={styles.removeBtn}
					onClick={onRemove}
					aria-label="Remove avatar"
					type="button"
				>
					Remove
				</button>
			)}
			<input
				ref={inputRef}
				type="file"
				accept={ACCEPT}
				className={styles.hiddenInput}
				onChange={handleChange}
				aria-hidden="true"
				tabIndex={-1}
			/>
		</div>
	);
}
