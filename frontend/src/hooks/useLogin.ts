import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { LOGIN_URL } from "@/config";
import { useAuth } from "@/contexts/useAuth";
import { ROLE_HOME, type Role } from "@/contexts/AuthContext";

type Usuario = {
  username: string;
  password: string;
};

type CustomError = AxiosError | Error | null;

type UseLoginResponse = {
  error: CustomError;
  isLoading: boolean;
  handlePostRequest: (user: Usuario) => void;
};

export default function useLogin(): UseLoginResponse {
  const navigate = useNavigate();
  const { login: login_service } = useAuth();

  const [error, setError] = useState<CustomError>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePostRequest = async (user: Usuario) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", user.username);
      params.append("password", user.password);

      const response = await axios.post(LOGIN_URL, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login_service(response.data); // ahora incluye role
      navigate(ROLE_HOME[response.data.role as Role]);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios:", error.response?.data || error.message);
        setError(error);
      } else if (error instanceof Error) {
        console.error("Error general:", error.message);
        setError(error);
      } else {
        console.error("Error desconocido", error);
        setError(new Error("Error desconocido"));
      }
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, handlePostRequest };
}
