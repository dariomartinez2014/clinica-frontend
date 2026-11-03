import { useEffect, useId, useRef } from "react";
import Spinner from "./Spinner";
interface Props {
  titulo: string; mensaje: string; cargando: boolean;
  onConfirmar: () => void; onCancelar: () => void;
  textoConfirmar?: string; textoCargando?: string;
}
export default function ModalConfirmacion({ titulo, mensaje, cargando, onConfirmar, onCancelar, textoConfirmar = "Confirmar", textoCargando = "Procesando..." }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const elemento = dialog.current;
    const focoAnterior = document.activeElement;
    elemento?.showModal();
    return () => { elemento?.close(); if (focoAnterior instanceof HTMLElement) focoAnterior.focus(); };
  }, []);
  return <dialog ref={dialog} aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-mensaje`} aria-busy={cargando}
    onCancel={(event) => { event.preventDefault(); if (!cargando) onCancelar(); }}
    onClick={(event) => { if (event.target === event.currentTarget && !cargando) onCancelar(); }}
    className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/50">
    <h2 id={`${id}-titulo`} className="text-xl font-bold">{titulo}</h2><p id={`${id}-mensaje`} className="mt-3 text-slate-600">{mensaje}</p>
    <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancelar} disabled={cargando} autoFocus className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50">Cancelar</button>
      <button type="button" onClick={onConfirmar} disabled={cargando} className="rounded-lg bg-red-700 px-4 py-2 text-white disabled:opacity-60">{cargando ? <><Spinner /> {textoCargando}</> : textoConfirmar}</button>
    </div>
  </dialog>;
}
