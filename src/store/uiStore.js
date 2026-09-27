import { create } from "zustand";

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),
  toasts: [],
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  pushToast: (message, type = "success") => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 4000);
  },
}));
