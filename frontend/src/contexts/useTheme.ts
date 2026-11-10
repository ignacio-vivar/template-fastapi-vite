import { useContext } from "react";
import { ThemeContext, type ThemeContextType } from "./ThemeContext";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("El contexto no está bien aplicado");
  }
  return context;
};
