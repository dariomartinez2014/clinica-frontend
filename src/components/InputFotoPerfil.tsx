import { useEffect, useId, useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export interface InputFotoPerfilProps {
  fotoActual?: string;
  onChange: (archivo: File | null) => void;
  disabled?: boolean;
}
export default function InputFotoPerfil({ fotoActual, onChange, disabled = false }: InputFotoPerfilProps) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [imagenFallida, setImagenFallida] = useState<string | null>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  function handleSeleccion(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    let mensaje = "";
    if (!archivo.type.startsWith("image/")) mensaje = "El archivo debe ser una imagen";
    else if (archivo.size > 5 * 1024 * 1024) mensaje = "La imagen no puede superar los 5MB";
    if (mensaje) { setError(mensaje); toast.error(mensaje); return; }
    setError("");
    setPreview(URL.createObjectURL(archivo));
    onChange(archivo);
  }
  const imagen = preview ?? fotoActual;
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
    <div className="flex flex-wrap items-center gap-5">
      <label htmlFor={id} className={`relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-emerald-100 text-emerald-700 shadow-sm ${disabled ? "opacity-60" : "cursor-pointer"}`}>
        {imagen && imagenFallida !== imagen ? <img src={imagen} alt="Foto de perfil" className="size-full object-cover" onError={() => setImagenFallida(imagen)} /> : <span aria-label="Sin foto de perfil" className="text-4xl" aria-hidden="true">♙</span>}
        <span className="absolute inset-x-0 bottom-0 bg-emerald-950/70 py-1 text-center text-xs text-white">Cambiar foto</span>
      </label>
      <input id={id} aria-label="Seleccionar foto de perfil" type="file" accept="image/*" hidden disabled={disabled} onChange={handleSeleccion} />
      <div><label htmlFor={id} className="cursor-pointer text-sm font-semibold text-emerald-700">Seleccionar imagen</label><p className="mt-2 text-sm text-slate-500">Imagen de hasta 5 MB.</p><p className="mt-1 max-w-xs text-xs text-slate-500">La previsualización es local. La foto se subirá al guardar.</p>
      {preview && <button type="button" disabled={disabled} className="mt-3 text-sm font-medium text-slate-600 underline" onClick={() => { setPreview(null); setError(""); onChange(null); }}>Quitar selección</button>}</div>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
  </div>;
}
