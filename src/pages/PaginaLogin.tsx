import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema } from "../schemas/loginSchema";
import type { LoginFormData } from "../schemas/loginSchema";
import { login } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import { extraerMensajeError } from "../lib/errorHandler";
export default function PaginaLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [errorServidor, setErrorServidor] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  async function onSubmit(datos: LoginFormData) {
    setErrorServidor("");
    try {
      const { token, usuario } = await login(datos);
      setAuth(token, usuario);
      toast.success("¡Bienvenido!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const mensaje = extraerMensajeError(err);
      setErrorServidor(mensaje);
      toast.error(mensaje);
    }
  }
  if (isAuthenticated) return <Navigate to="/" replace />;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="mb-2 font-semibold text-emerald-700">
          Clínica Salud Integral
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Iniciar sesión</h1>
        <p className="mb-6 mt-3 text-sm text-slate-600">
          Ingresa con tu cuenta para acceder al panel de la clínica.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              {...register("email")}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 focus-visible:outline-emerald-600"
            />
            {errors.email && (
              <p
                id="error-email"
                role="alert"
                className="mt-1 text-sm text-red-700"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium"
            >
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "error-password" : undefined}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 focus-visible:outline-emerald-600"
            />
            {errors.password && (
              <p
                id="error-password"
                role="alert"
                className="mt-1 text-sm text-red-700"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          {errorServidor && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
            >
              {errorServidor}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
