import { create } from 'zustand';
import { auth } from '../firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const useAuthStore = create((set) => ({
  isLoginOpen: false,
  isSignUpOpen: false,
  user: null,
  loading: true,
  error: null,

  openLogin: () => set({ isLoginOpen: true, isSignUpOpen: false, error: null }),
  openSignUp: () => set({ isSignUpOpen: true, isLoginOpen: false, error: null }),
  closeModals: () => set({ isLoginOpen: false, isSignUpOpen: false, error: null }),

  // Initialize Auth Listener
  initializeAuth: () => {
    set({ loading: true });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  // Signup
  signup: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Success is handled by onAuthStateChanged
      set({ isSignUpOpen: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ isLoginOpen: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Google Login
  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      set({ isLoginOpen: false, isSignUpOpen: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Logout error", error);
    }
  },
}));

export default useAuthStore;

