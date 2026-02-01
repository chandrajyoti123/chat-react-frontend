import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponseDto } from '@/api/generated';

interface AuthState {
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: UserResponseDto | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) => {
        return set({ accessToken, refreshToken });
      },

      logout: () =>
        set(() => ({
          user: null,
          accessToken: null,
          refreshToken: null,
        })),
    }),
    {
      name: 'auth-store', // key in localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
