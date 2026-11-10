import { useContext } from "react";
import { type AuthContextType, AuthContext } from "./AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("El contexto no está bien aplicado");
  }
  return context;
};
