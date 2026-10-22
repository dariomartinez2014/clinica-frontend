import type { ChangeEvent } from "react";
import { useFiltrosStore } from "../stores/filtrosStore";
export default function BuscadorPacientes() {
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
      <input
        id="buscar-pacientes"
        type="search"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        placeholder="Nombre, apellido o correo"
        aria-describedby="ayuda-busqueda"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      />
      <p id="ayuda-busqueda" className="mt-2 text-sm text-slate-500">
        Busca por nombre, apellido o correo.
      </p>
    </div>
  );
}
