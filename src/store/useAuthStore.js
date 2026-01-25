import { create } from 'zustand';

import { supabase } from '../lib/supabase';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const useAuthStore = create((set, get) => ({
  isLoginOpen: false,
  isSignUpOpen: false,
  isRoleSelectionOpen: false,
  user: null,
  userRole: null, // 'investor' | 'advisor' | null
  loading: false,
  error: null,
  googleLoaded: false,

  openLogin: () => set({ isLoginOpen: true, isSignUpOpen: false, error: null }),
  openSignUp: () => set({ isSignUpOpen: true, isLoginOpen: false, error: null }),
  closeModals: () => set({ isLoginOpen: false, isSignUpOpen: false, error: null }),
  openRoleSelection: () => set({ isRoleSelectionOpen: true }),
  closeRoleSelection: () => set({ isRoleSelectionOpen: false }),

  setUserRole: (role) => {
    const user = get().user;
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem('credence_user', JSON.stringify(updatedUser));
      set({ userRole: role, user: updatedUser, isRoleSelectionOpen: false });
    }
  },

  initializeAuth: () => {
    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false });
      if (session?.user) {
        // Fetch role from profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log("Auth Init: Profile Fetch Result:", { profile, error });

        if (profile?.role) {
          set({ userRole: profile.role });
        } else {
          console.warn("Auth Init: No role found, opening selection.");
          // If no role, open role selection
          set({ isRoleSelectionOpen: true });
        }
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null, loading: false });
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log("Auth Change: Profile Fetch Result:", { profile, error });

        if (profile?.role) set({ userRole: profile.role });
        else set({ isRoleSelectionOpen: true });
      } else {
        set({ userRole: null });
      }
    });

    return () => subscription.unsubscribe();
  },

  signup: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: email.split('@')[0] }
      }
    });

    if (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
    // Auth state update handled by subscription
    set({ isSignUpOpen: false, isLoginOpen: false, loading: false });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
    // Auth state update handled by subscription
    set({ isLoginOpen: false, isSignUpOpen: false, loading: false });
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error", error);
    }
    set({ user: null, userRole: null });
  },
}));

export default useAuthStore;
