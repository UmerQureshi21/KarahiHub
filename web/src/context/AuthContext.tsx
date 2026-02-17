import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { setAuthListener } from "../services/userService";

type AuthState = {
  username: string | null;
  email: string | null;
};

type AuthContextType = AuthState & {
  setUser: (username: string | null, email: string | null) => void;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Hook for components to read and react to auth state changes.
// Any component that calls this will re-render when setUser/clearUser is called.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ username: null, email: null });

  const setUser = useCallback((username: string | null, email: string | null) => {
    setAuth({ username, email });
  }, []);

  const clearUser = useCallback(() => {
    setAuth({ username: null, email: null });
  }, []);

  // Register the listener so userService can push auth changes into React.
  // Whenever login/register/refresh/logout runs, it calls notifyAuthChange()
  // which triggers setUser here, causing all useAuth() consumers to re-render.
  useEffect(() => {
    setAuthListener(setUser);
    return () => setAuthListener(null);
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ ...auth, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}
