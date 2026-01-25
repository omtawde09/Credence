import { create } from 'zustand';

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
    const savedUser = localStorage.getItem('credence_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        set({ user, userRole: user.role || null, loading: false });
      } catch (e) {
        localStorage.removeItem('credence_user');
        set({ loading: false });
      }
    } else {
      set({ loading: false });
    }

    if (!window.google && !get().googleLoaded) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        set({ googleLoaded: true });
      };
      document.head.appendChild(script);
    }

    return () => { };
  },

  signup: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = {
        email,
        name: email.split('@')[0],
        picture: null,
        provider: 'email',
        role: null
      };
      localStorage.setItem('credence_user', JSON.stringify(user));
      set({ user, isSignUpOpen: false, isLoginOpen: false, loading: false, isRoleSelectionOpen: true });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = {
        email,
        name: email.split('@')[0],
        picture: null,
        provider: 'email',
        role: null
      };
      localStorage.setItem('credence_user', JSON.stringify(user));
      set({ user, isLoginOpen: false, isSignUpOpen: false, loading: false, isRoleSelectionOpen: true });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });

    return new Promise((resolve, reject) => {
      if (!window.google) {
        set({ error: 'Google authentication not loaded yet. Please try again.', loading: false });
        reject(new Error('Google not loaded'));
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              const user = {
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                provider: 'google',
                role: null
              };
              localStorage.setItem('credence_user', JSON.stringify(user));
              set({ user, isLoginOpen: false, isSignUpOpen: false, loading: false, isRoleSelectionOpen: true });
              resolve(user);
            } else {
              set({ error: 'Google login failed', loading: false });
              reject(new Error('No credential'));
            }
          },
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            window.google.accounts.oauth2.initTokenClient({
              client_id: GOOGLE_CLIENT_ID,
              scope: 'email profile',
              callback: async (tokenResponse) => {
                if (tokenResponse.access_token) {
                  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                  });
                  const payload = await res.json();
                  const user = {
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    provider: 'google',
                    role: null
                  };
                  localStorage.setItem('credence_user', JSON.stringify(user));
                  set({ user, isLoginOpen: false, isSignUpOpen: false, loading: false, isRoleSelectionOpen: true });
                  resolve(user);
                }
              },
            }).requestAccessToken();
          }
        });
      } catch (error) {
        set({ error: error.message, loading: false });
        reject(error);
      }
    });
  },

  logout: async () => {
    try {
      localStorage.removeItem('credence_user');
      set({ user: null, userRole: null });
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  },
}));

export default useAuthStore;
