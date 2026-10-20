import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminInfo {
  id: string;
  username: string;
}

interface AdminStore {
  token: string | null;
  admin: AdminInfo | null;
  setSession: (token: string, admin: AdminInfo) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      setSession: (token, admin) => {
        set({ token, admin });
      },
      clearSession: () => {
        set({ token: null, admin: null });
      },
      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: 'elenor-admin-session',
    }
  )
);
