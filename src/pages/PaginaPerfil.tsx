import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import InputFotoPerfil from "../components/InputFotoPerfil";
import { perfilSchema } from "../schemas/perfilSchema";
import type { PerfilFormData } from "../schemas/perfilSchema";
import { actualizarPerfil } from "../services/perfil";
import { useAuthStore } from "../stores/authStore";
import { extraerMensajeError } from "../lib/errorHandler";

export default function PaginaPerfil() {
  const usuario = useAuthStore((s) => s.usuario);
  const actualizarUsuario = useAuthStore((s) => s.actualizarUsuario);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [versionFoto, setVersionFoto] = useState(0);
  const [errorServidor, setErrorServidor] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nombre: usuario?.nombre ?? "", email: usuario?.email ?? "", telefono: usuario?.telefono ?? "" },
  });
  async function onSubmit(datos: PerfilFormData) {
    const token = useAuthStore.getState().token;
    const formData = new FormData();
    formData.append("nombre", datos.nombre);
    formData.append("email", datos.email);
    // Se envía vacío para permitir borrar un teléfono anterior.
    formData.append("telefono", datos.telefono ?? "");
    if (archivoFoto) formData.append("foto", archivoFoto);
    setErrorServidor("");
    try {
      const actualizado = await actualizarPerfil(formData);
      // Una petición pendiente no debe restaurar datos después de cerrar sesión.
      if (useAuthStore.getState().token !== token) return;
      actualizarUsuario(actualizado);
      reset({ nombre: actualizado.nombre, email: actualizado.email, telefono: actualizado.telefono ?? "" });
      setArchivoFoto(null); setVersionFoto((n) => n + 1);
      toast.success("Perfil actualizado");
    } catch (err: unknown) {
      const mensaje = extraerMensajeError(err); setErrorServidor(mensaje); toast.error(mensaje);
    }
  }
  const estilo = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-visible:outline-emerald-600 disabled:opacity-60";
  return <main className="mx-auto max-w-3xl p-6 md:p-8"><p className="text-sm font-semibold text-emerald-700">MI CUENTA</p><h1 className="mt-2 text-3xl font-bold">Mi perfil</h1><p className="mt-3 text-sm text-slate-600">Actualiza tus datos y elige la foto que aparecerá en tu cuenta.</p>
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <InputFotoPerfil key={versionFoto} fotoActual={usuario?.foto ?? undefined} onChange={setArchivoFoto} disabled={isSubmitting} />
      <div><label htmlFor="perfil-nombre" className="text-sm font-semibold">Nombre completo</label><input id="perfil-nombre" autoComplete="name" {...register("nombre")} disabled={isSubmitting} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? "error-nombre" : undefined} className={estilo} />{errors.nombre && <p role="alert" id="error-nombre" className="mt-1 text-sm text-red-700">{errors.nombre.message}</p>}</div>
      <div><label htmlFor="perfil-email" className="text-sm font-semibold">Correo electrónico</label><input id="perfil-email" type="email" autoComplete="email" {...register("email")} disabled={isSubmitting} aria-invalid={!!errors.email} aria-describedby={errors.email ? "error-perfil-email" : undefined} className={estilo} />{errors.email && <p role="alert" id="error-perfil-email" className="mt-1 text-sm text-red-700">{errors.email.message}</p>}</div>
      <div><label htmlFor="perfil-telefono" className="text-sm font-semibold">Teléfono <span className="font-normal text-slate-500">(opcional)</span></label><input id="perfil-telefono" type="tel" inputMode="numeric" autoComplete="tel" placeholder="8 a 15 dígitos" {...register("telefono")} disabled={isSubmitting} aria-invalid={!!errors.telefono} aria-describedby={errors.telefono ? "error-telefono" : undefined} className={estilo} />{errors.telefono && <p role="alert" id="error-telefono" className="mt-1 text-sm text-red-700">{errors.telefono.message}</p>}</div>
      {errorServidor && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorServidor}</p>}
      <div className="flex justify-end border-t border-slate-100 pt-5"><button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Guardando…" : "Guardar"}</button></div>
    </form></main>;
}
