import { useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';
import type { User, Collaborator } from '@/types';

export function useAuth() {
  const {
    user,
    collaborator,
    token,
    loading,
    error,
    setUser,
    setCollaborator,
    setToken,
    setLoading,
    setError,
    logout: storeLogout,
  } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await handleAuthUser(firebaseUser);
      } else {
        storeLogout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthUser = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      setToken(token);

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };
      setUser(user);

      // Fetch collaborator data from backend
      const response = await apiClient.collaborators.getByFirebaseUid(firebaseUser.uid);
      const collaboratorData: Collaborator = response.data;
      setCollaborator(collaboratorData);

      // Update language preference if different
      const preferredLang = collaboratorData.preferredLanguage;
      const currentLang = localStorage.getItem('i18nextLng');
      if (preferredLang && preferredLang !== currentLang) {
        localStorage.setItem('i18nextLng', preferredLang);
        window.location.reload(); // Reload to apply language
      }
    } catch (error: any) {
      console.error('Error fetching collaborator data:', error);
      setError(error.message || 'Failed to fetch user data');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthUser(userCredential.user);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      storeLogout();
    } catch (error: any) {
      setError(error.message || 'Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    if (auth.currentUser) {
      const newToken = await auth.currentUser.getIdToken(true);
      setToken(newToken);
      return newToken;
    }
    return null;
  };

  return {
    user,
    collaborator,
    token,
    loading,
    error,
    signIn,
    signOut,
    refreshToken,
    isAuthenticated: !!user,
    isManager: collaborator?.role === 'manager',
  };
}
