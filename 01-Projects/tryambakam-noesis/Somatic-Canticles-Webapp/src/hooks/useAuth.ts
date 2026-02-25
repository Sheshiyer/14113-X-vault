"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import type { User, UserProfile, UserSession } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birthDate: Date;
  timezone?: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface UseAuthReturn {
  /** Current user */
  user: User | null;
  /** Extended user profile */
  profile: UserProfile | null;
  /** Authentication state */
  isAuthenticated: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Whether auth is being checked */
  isChecking: boolean;
  /** Authentication error */
  error: AuthError | null;
  /** Login handler */
  login: (credentials: LoginCredentials) => Promise<boolean>;
  /** Logout handler */
  logout: () => Promise<void>;
  /** Register handler */
  register: (data: RegisterData) => Promise<boolean>;
  /** Update user profile */
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  /** Refresh session */
  refreshSession: () => Promise<void>;
  /** Clear error */
  clearError: () => void;
}

/**
 * Hook for managing authentication state and operations
 *
 * Features:
 * - Auth state management
 * - Login/logout handlers
 * - Session checking
 * - Profile management
 */
export function useAuth(): UseAuthReturn {
  const { data: session, status, update: updateSession } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const isAuthenticated = status === "authenticated";
  const isChecking = status === "loading";

  // Fetch user profile when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile(session.user.id);
    } else {
      setProfile(null);
    }
  }, [session]);

  // Fetch user profile from API
  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        }
      }
    } catch {
      // Silently fail - profile is optional enhancement
    }
  };

  // Login handler
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          setError({
            code: "invalid_credentials",
            message: "Invalid email or password",
            field: "email",
          });
          return false;
        }

        if (result?.ok) {
          return true;
        }

        return false;
      } catch (err) {
        setError({
          code: "login_failed",
          message: err instanceof Error ? err.message : "Login failed",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout handler
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } finally {
      setIsLoading(false);
      setProfile(null);
    }
  }, []);

  // Register handler
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          birthDate: data.birthDate.toISOString(),
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          code: result.error?.code || "registration_failed",
          message: result.error?.message || "Registration failed",
          field: result.error?.field,
        });
        return false;
      }

      // Auto-login after successful registration
      if (result.success) {
        const loginResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        return loginResult?.ok ?? false;
      }

      return false;
    } catch (err) {
      setError({
        code: "registration_failed",
        message: err instanceof Error ? err.message : "Registration failed",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<boolean> => {
      if (!session?.user?.id) {
        setError({
          code: "not_authenticated",
          message: "You must be logged in to update your profile",
        });
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${session.user.id}/profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (!response.ok) {
          setError({
            code: result.error?.code || "update_failed",
            message: result.error?.message || "Failed to update profile",
            field: result.error?.field,
          });
          return false;
        }

        // Update local profile state
        setProfile((prev) => (prev ? { ...prev, ...updates } : null));

        // Update session if name or email changed
        if (updates.name || updates.email) {
          await updateSession();
        }

        return true;
      } catch (err) {
        setError({
          code: "update_failed",
          message: err instanceof Error ? err.message : "Update failed",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user?.id, updateSession]
  );

  // Refresh session
  const refreshSession = useCallback(async (): Promise<void> => {
    await updateSession();
  }, [updateSession]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Build user object from session
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        birthDate: session.user.birthdate
          ? new Date(session.user.birthdate)
          : new Date(),
        timezone: session.user.timezone || "UTC",
        createdAt: new Date(), // Session doesn't include createdAt
      }
    : null;

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isChecking,
    error,
    login,
    logout,
    register,
    updateProfile,
    refreshSession,
    clearError,
  };
}

/**
 * Hook for checking auth status on mount
 * Useful for protected routes
 */
export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isChecking } = useAuth();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isChecking, redirectTo]);

  return { isAuthenticated, isChecking };
}

/**
 * Hook for getting the current session on server components
 */
export async function getServerSession(): Promise<UserSession | null> {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  return {
    userId: session.user.id,
    token: (session.user as { apiToken?: string }).apiToken || "",
    expiresAt: new Date(session.expires || Date.now() + 86400000),
  };
}
