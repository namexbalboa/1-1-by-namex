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
      loading: true,
      error: null,

      setUser: (user) => set({ user }),
      setCollaborator: (collaborator) => set({ collaborator }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      logout: () => {
        console.log('🧹 Cleaning up auth storage...');

        // Clear state
        set({
          user: null,
          collaborator: null,
          token: null,
          error: null
        });

        // Clear auth-specific localStorage keys
        localStorage.removeItem('auth-storage');

        // Keep Firebase and i18n settings, but clear everything else from this app
        const appKeysToKeep = ['firebase:', 'i18nextLng'];
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            // Keep Firebase auth data and language preference
            const shouldKeep = appKeysToKeep.some(prefix => key.startsWith(prefix));
            if (!shouldKeep && !key.includes('scrum') && !key.includes('welcome-shown')) {
              // Only remove keys that are clearly from this 1:1 app
              if (key.includes('auth') || key.includes('1-1') || key.includes('user')) {
                keysToRemove.push(key);
              }
            }
          }
        }

        keysToRemove.forEach(key => {
          console.log(`🗑️  Removing localStorage key: ${key}`);
          localStorage.removeItem(key);
        });

        console.log('✅ Auth storage cleaned');
      },
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
