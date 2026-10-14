import type { Paciente } from '../types/paciente';
import BadgeEstado from './BadgeEstado';

// PROPS: recibo todos los datos del paciente en un solo objeto.
interface PacienteCardProps {
  paciente: Paciente;
}

export default function PacienteCard({ paciente }: PacienteCardProps) {
  return (
    <article aria-labelledby={`nombre-${paciente.id}`} className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{paciente.id}</p>
          <h2 id={`nombre-${paciente.id}`} className="mt-1 text-lg font-bold">{paciente.nombre} {paciente.apellido}</h2>
        </div>
        {/* ESTADO: reutilizo la etiqueta para no repetir colores ni condiciones. */}
        <BadgeEstado estado={paciente.estado} />
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div><dt className="text-slate-500">Correo electrónico</dt><dd className="break-all">{paciente.email}</dd></div>
        <div><dt className="text-slate-500">Teléfono</dt><dd>{paciente.telefono}</dd></div>
        <div><dt className="text-slate-500">Especialidad asignada</dt><dd>{paciente.especialidadAsignada}</dd></div>
        <div><dt className="text-slate-500">Última cita</dt><dd><time dateTime={paciente.ultimaCita}>{paciente.ultimaCita}</time></dd></div>
      </dl>
    </article>
  );
}
