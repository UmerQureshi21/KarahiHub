import { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { setAuthListener, refresh } from "../services/userService";
import { AuthContext } from "./useAuth";
import type { AuthState } from "./useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ username: null, email: null });
  const [initializing, setInitializing] = useState(true);

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

  // On app startup (page refresh), try to restore the session from the
  // httpOnly refresh_token cookie. If it fails (no cookie / expired),
  // the user stays logged out. Protected routes wait for this to finish
  // before deciding whether to redirect to /auth.
  useEffect(() => {
    refresh()
      .catch(() => {})
      .finally(() => setInitializing(false));
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, initializing, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}
