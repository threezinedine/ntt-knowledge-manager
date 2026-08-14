import { ToastMessage } from "../../../components/toast-message";
import { useToastStore } from "../store";

export function ToastContainer() {
	const { toasts, dismiss } = useToastStore();

	return (
		<>
			{toasts.map((toast) => (
				<ToastMessage
					key={toast.id}
					title={toast.title}
					description={toast.description}
					variant={toast.variant}
					position={toast.position}
					duration={toast.duration}
					onClose={() => dismiss(toast.id)}
				/>
			))}
		</>
	);
}
