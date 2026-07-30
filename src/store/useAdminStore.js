import { create } from "zustand";

// Mock de estado - futuramente pode vir de auth/role real
export const useAdminStore = create((set) => ({
  isAdmin: false,
  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),
}));