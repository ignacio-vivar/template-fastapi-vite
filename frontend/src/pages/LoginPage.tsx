import { type loginForm, loginSchema } from "@/schemas/login.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useLogin from "@/hooks/useLogin";
import { useState } from "react";
import "./login-page.css"

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginForm>({ resolver: zodResolver(loginSchema) });

  const { handlePostRequest, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: loginForm) => {
    handlePostRequest(data);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <h1>Bienvenido</h1>

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              {...register("username")}
              id="username"
              type="text"
            />
            {errors?.username?.message && (
              <span className="error-text">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors?.password?.message && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Iniciar Sesión
          </button>

          {error && <div className="api-error">Revisar credenciales</div>}
        </form>
      </div>
    </div>
  );
}
