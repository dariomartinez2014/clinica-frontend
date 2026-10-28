import type { ChangeEvent } from "react";
import { useFiltrosStore } from "../stores/filtrosStore";
export default function BuscadorPacientes({
  buscando = false,
}: {
  buscando?: boolean;
}) {
  const value = useFiltrosStore((s) => s.queryPacientes);
  const onChange = useFiltrosStore((s) => s.setQueryPacientes);
  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <label
        htmlFor="buscar-pacientes"
        className="mb-2 block text-sm font-medium"
      >
        Buscar pacientes
      </label>
      <div className="relative">
        <input
          id="buscar-pacientes"
          type="search"
          aria-busy={buscando}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          placeholder="Nombre, apellido o correo"
          aria-describedby="ayuda-busqueda"
          className="w-full rounded-lg border border-slate-300 pl-3 pr-12 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        />
        {buscando && (
          <span
            role="status"
            aria-label="Buscando pacientes"
            className="pointer-events-none absolute right-4 top-3 h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent"
          />
        )}
      </div>
      <p id="ayuda-busqueda" className="mt-2 text-sm text-slate-500">
        Busca por nombre, apellido o correo.
      </p>
    </div>
  );
}
