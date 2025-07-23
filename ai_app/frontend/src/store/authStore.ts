import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser, LoginRequest } from "@/types";
import { apiClient } from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.login(credentials);
          const { user, token } = response;

          // Store token in API client
          apiClient.setToken(token);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login failed";
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear API client auth
        apiClient.clearAuth();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: AuthUser | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      initializeAuth: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token");
          const userStr = localStorage.getItem("user");

          if (token && userStr) {
            try {
              const user = JSON.parse(userStr) as AuthUser;
              apiClient.setToken(token);
              set({
                user,
                isAuthenticated: true,
              });
            } catch (error) {
              // Clear invalid stored data
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
            }
          }
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-initialize API client with stored token
        if (state?.user && typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token");
          if (token) {
            apiClient.setToken(token);
          }
        }
      },
    },
  ),
);

// Selectors for convenience
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  return { user, isAuthenticated, isLoading, error };
};

export const useAuthActions = () => {
  const { login, logout, clearError, setUser, initializeAuth } = useAuthStore();
  return { login, logout, clearError, setUser, initializeAuth };
};
