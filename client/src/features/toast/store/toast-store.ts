import { create } from "zustand";
import type { ToastVariant, ToastPosition } from "../../../components/toast-message";

export type ToastOptions = {
	title: string;
	description?: string;
	variant?: ToastVariant;
	position?: ToastPosition;
	duration?: number;
};

export type ToastEntry = ToastOptions & {
	id: number;
};

type ToastState = {
	toasts: ToastEntry[];
	show: (options: ToastOptions) => void;
	dismiss: (id: number) => void;
	info: (title: string, description?: string) => void;
	success: (title: string, description?: string) => void;
	warn: (title: string, description?: string) => void;
	error: (title: string, description?: string) => void;
};

let nextId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
	toasts: [],
	show: (options) => {
		const id = nextId++;
		set((state) => ({ toasts: [...state.toasts, { ...options, id }] }));
	},
	dismiss: (id) => {
		set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
	},
	info: (title, description) => {
		get().show({ title, description, variant: "info" });
	},
	success: (title, description) => {
		get().show({ title, description, variant: "success" });
	},
	warn: (title, description) => {
		get().show({ title, description, variant: "warn" });
	},
	error: (title, description) => {
		get().show({ title, description, variant: "error" });
	},
}));
