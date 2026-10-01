import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("ems_token") || null,
  user: null,

  setSession: (token) => {
    localStorage.setItem("ems_token", token);
    set({ token: token });
  },
  logout: () => {
    localStorage.removeItem("ems_token");
    set({ token: null, user: null });
  },
  loadUser: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        set({ user: await response.json() });
      } else if (response.status === 401) {
        get().logout();
      }
    } catch {}
  },
}));
