import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password,
          });

          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: unknown) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || 'Login failed'
            : 'Login failed';

          set({
            error: message,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post('/api/auth/register', data);

          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || 'Registration failed'
            : 'Registration failed';

          set({
            error: message,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        delete axios.defaults.headers.common['Authorization'];
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);