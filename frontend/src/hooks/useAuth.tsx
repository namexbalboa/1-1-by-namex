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

// Initialize auth listener once, outside of React lifecycle
let authListenerInitialized = false;

const initializeAuthListener = () => {
  if (authListenerInitialized) {
    console.log('🔄 Auth listener already initialized globally, skipping');
    return;
  }

  authListenerInitialized = true;
  console.log('🚀 Initializing Firebase auth listener (GLOBAL)');

  const {
    setUser,
    setCollaborator,
    setToken,
    setLoading,
    setError,
    logout: storeLogout,
  } = useAuthStore.getState();

  setLoading(true);

  onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('🔄 onAuthStateChanged triggered, firebaseUser:', firebaseUser?.uid);

    if (firebaseUser) {
      await handleAuthUser(firebaseUser);
    } else {
      console.log('🚪 No Firebase user, calling storeLogout()');
      storeLogout();
    }

    console.log('✅ Setting loading to false');
    setLoading(false);
  });
};

const handleAuthUser = async (firebaseUser: FirebaseUser) => {
  const {
    setUser,
    setCollaborator,
    setToken,
    setError,
    logout: storeLogout,
  } = useAuthStore.getState();

  try {
    console.log('🔐 Handling auth user:', firebaseUser.uid, firebaseUser.email);

    const token = await firebaseUser.getIdToken();
    setToken(token);

    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
    setUser(user);

    // Fetch collaborator data
    const collaborator = useAuthStore.getState().collaborator;
    if (!collaborator || collaborator.firebaseUid !== firebaseUser.uid) {
      console.log('📡 Fetching collaborator from backend...');
      const response = await apiClient.collaborators.getByFirebaseUid(firebaseUser.uid);
      const collaboratorData: Collaborator = response.data;
      console.log('✅ Collaborator found:', collaboratorData);
      setCollaborator(collaboratorData);

      // Update language preference
      const preferredLang = collaboratorData.preferredLanguage;
      const currentLang = localStorage.getItem('i18nextLng');
      if (preferredLang && preferredLang !== currentLang) {
        localStorage.setItem('i18nextLng', preferredLang);
      }
    } else {
      console.log('✅ Collaborator already loaded, skipping fetch');
    }
  } catch (error: any) {
    console.error('❌ Error fetching collaborator data:', error);

    if (error?.response?.status === 404) {
      setError('Usuário não cadastrado no sistema. Entre em contato com o administrador.');
    } else if (error?.code === 'ERR_NETWORK') {
      setError('Erro de conexão com o servidor. Verifique sua internet.');
    } else {
      setError(error.message || 'Erro ao buscar dados do usuário');
    }

    console.log('🚪 Signing out user due to error');
    await firebaseSignOut(auth);
    storeLogout();
  }
};

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

  // Initialize listener on first hook call
  useEffect(() => {
    initializeAuthListener();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔑 Signing in with email:', email);

      // Just sign in - onAuthStateChanged will handle the rest
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase sign in successful - onAuthStateChanged will handle user data');

      // Don't call handleAuthUser here - it will be called by onAuthStateChanged
    } catch (error: any) {
      console.error('❌ Login error:', error);

      // User-friendly error messages based on Firebase error codes
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setError('Email ou senha incorretos. Verifique suas credenciais.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Verifique o email informado.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Tente novamente mais tarde.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Erro de conexão. Verifique sua internet.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique o formato do email.');
      } else {
        setError(error.message || 'Erro ao fazer login. Tente novamente.');
      }
      setLoading(false);
      throw error;
    }
    // Don't set loading false here - let onAuthStateChanged handle it
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
