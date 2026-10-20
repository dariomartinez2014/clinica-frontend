import type { ChangeEvent } from 'react';
// La página guarda el texto de búsqueda.
interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BuscadorPacientes({ value, onChange }: BuscadorPacientesProps) {
  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <label htmlFor="buscar-pacientes" className="mb-2 block text-sm font-medium">Buscar pacientes</label>
      <input
        id="buscar-pacientes"
        type="search"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder="Nombre del paciente"
        aria-describedby="ayuda-busqueda"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      />
      {/* La búsqueda se combina con el filtro de estado. */}
      <p id="ayuda-busqueda" className="mt-2 text-sm text-slate-500">Busca por nombre y combina la búsqueda con el estado.</p>
    </div>
  );
}
