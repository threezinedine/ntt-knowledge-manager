import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { ReactNode } from "react";
import styles from "./modal.module.scss";

export type ModalRef = {
	open: () => void;
	close: () => void;
};

type ModalProps = {
	children: ReactNode;
	onClose?: () => void;
};

export const Modal = forwardRef<ModalRef, ModalProps>(function Modal(
	{ children, onClose },
	ref,
) {
	const [isOpen, setIsOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => setIsOpen(true),
		close: () => {
			setIsOpen(false);
			onClose?.();
		},
	}));

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
				onClose?.();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleBackdropClick = () => {
		setIsOpen(false);
		onClose?.();
	};

	return (
		<div
			className={styles.backdrop}
			role="dialog"
			aria-modal="true"
			onPointerDown={handleBackdropClick}
		>
			<div
				className={styles.content}
				onPointerDown={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
});
