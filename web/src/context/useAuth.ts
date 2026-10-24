import { createContext, useContext } from "react";

export type AuthState = {
  username: string | null;
  email: string | null;
};

export type AuthContextType = AuthState & {
  // true until the startup session restore (refresh cookie → access token) has finished
  initializing: boolean;
  setUser: (username: string | null, email: string | null) => void;
  clearUser: () => void;
};

// Lives in its own file (not AuthContext.tsx) so that file only exports
// components, which Vite's fast refresh needs.
export const AuthContext = createContext<AuthContextType | null>(null);

// Hook for components to read and react to auth state changes.
// Any component that calls this will re-render when setUser/clearUser is called.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
