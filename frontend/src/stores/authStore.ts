import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { apiService } from '@/services/api'; 


export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          // Use centralized apiService for the network request
          const data = await apiService.login({ email, password });
          const { user, token } = data;

          // Synchronize token with localStorage for the ApiService interceptor
          localStorage.setItem('auth-token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || 'Login failed'
            : 'An unexpected error occurred';

          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const data = await apiService.register(userData);
          const { user, token } = data;

          // Synchronize token for the interceptor
          localStorage.setItem('auth-token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || 'Registration failed'
            : 'An unexpected error occurred';

          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Remove token so the ApiService interceptor stops sending it
        localStorage.removeItem('auth-token');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // Only persist these keys to localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);