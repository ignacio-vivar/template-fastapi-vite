import { createContext } from "react";

export type Role = "admin" | "not_admin";

export const ROLE_HOME: Record<Role, string> = {
  admin: "/dashboard-admin",
  not_admin: "/dashboard",
};

export interface Token {
  access_token: string;
  token_type: string;
  role: Role;
}

export interface AuthContextType {
  token: Token | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (tokenObj: Token) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
