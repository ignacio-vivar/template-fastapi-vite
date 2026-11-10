import { useCallback, useEffect, useState, type ReactNode } from "react";
import { setAuthHandlers } from "@/services/authServices";
import { AuthContext, ROLE_HOME, type Token } from "./AuthContext";

function readStoredToken(): Token | null {
  try {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) return null;
    const parsed = JSON.parse(tokenData);
    if (!parsed?.role || !(parsed.role in ROLE_HOME)) {
      localStorage.removeItem("token");
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Error parsing token:", error);
    localStorage.removeItem("token");
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<Token | null>(readStoredToken);

  const login = useCallback((tokenObj: Token) => {
    localStorage.setItem("token", JSON.stringify(tokenObj));
    setToken(tokenObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  useEffect(() => {
    setAuthHandlers({ login, logout });
  }, [login, logout]);

  return (
    <AuthContext.Provider
      value={{ token, role: token?.role ?? null, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
