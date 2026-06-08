import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setAuth: (user, token) => set({ user, token, isLoading: false }),
  clearAuth: () => set({ user: null, token: null }),
  setLoading: (v) => set({ isLoading: v }),
}));
