// Problemas encontrados en el código generado por la IA:
// 1. La página mezclaba buscador, tarjetas y estados en un solo componente.
// 2. El arreglo se creaba dentro de la función en cada render; lo moví a src/data.
// 3. El texto y el color del estado usaban ternarios anidados por separado.
//    Ahora BadgeEstado centraliza ambos y evita que las condiciones difieran.
// La primera versión está en docs/dia-2/PaginaPacientesIA.tsx.txt.

import { useState } from 'react';
import PacienteCard from '../components/PacienteCard';
import BuscadorPacientes from '../components/BuscadorPacientes';
import { pacientesEjemplo } from '../data/pacientes';

export default function PaginaPacientes() {
  // ESTADO LOCAL: por ahora guardo lo que escribo, sin filtrar ni hacer CRUD.
  const [busqueda, setBusqueda] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-bold text-emerald-700">Clínica Salud Integral</p>
          <p className="mt-1 text-sm text-slate-500">Panel de administración</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <p className="mt-2 text-slate-600">Directorio de pacientes de la clínica.</p>
        <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
        <p className="mb-4 text-sm text-slate-600">{pacientesEjemplo.length} pacientes de ejemplo</p>
        {/* RESPONSIVO: columna en móvil y grid de tarjetas desde escritorio. */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
          {pacientesEjemplo.map(paciente => <PacienteCard key={paciente.id} paciente={paciente} />)}
        </div>
        <p className="mt-6 text-sm text-slate-500">Datos ficticios para la práctica, sin información de pacientes reales.</p>
      </main>
    </div>
  );
}
