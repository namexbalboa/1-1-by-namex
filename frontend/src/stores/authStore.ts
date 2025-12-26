import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Collaborator } from '@/types';

interface AuthStore {
  user: User | null;
  collaborator: Collaborator | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setCollaborator: (collaborator: Collaborator | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      collaborator: null,
      token: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setCollaborator: (collaborator) => set({ collaborator }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      logout: () => set({
        user: null,
        collaborator: null,
        token: null,
        error: null
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        collaborator: state.collaborator,
      }),
    }
  )
);
