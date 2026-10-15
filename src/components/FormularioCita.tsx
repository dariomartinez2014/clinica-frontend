import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { citaSchema } from '../schemas/citaSchema';
import type { CitaFormData } from '../schemas/citaSchema';
import { useMedicos } from '../hooks/useMedicos';

// VALORES INICIALES: los reutilizo cuando quiero agendar otra cita.
const valoresIniciales: CitaFormData = {
  pacienteNombre: '', medicoId: '', fecha: '', hora: '', motivo: '', urgencia: 'baja',
};

export default function FormularioCita() {
  const { medicos, cargando } = useMedicos();
  const [citaConfirmada, setCitaConfirmada] = useState<CitaFormData | null>(null);
  // FECHA MÍNIMA: calculo el valor del enunciado al abrir el formulario.
  const [fechaMinima] = useState(() => new Date().toISOString().split('T')[0]);

  // FORMULARIO: RHF registra los campos y Zod revisa sus reglas al enviarlos.
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: valoresIniciales,
  });

  // ENVÍO: simulo 1.5 segundos de espera; los datos solo quedan en memoria.
  async function agendarCita(datos: CitaFormData) {
    await new Promise<void>(resolve => setTimeout(resolve, 1500));
    setCitaConfirmada(datos);
  }

  function agendarOtraCita() {
    reset(valoresIniciales);
    setCitaConfirmada(null);
  }

  // ESTILOS: agrego el borde rojo solamente cuando el campo tiene un error.
  function claseCampo(conError: boolean) {
    return `mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 ${conError ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200'}`;
  }

  if (citaConfirmada) {
    const medico = medicos.find(medico => medico.id === citaConfirmada.medicoId);
    return (
      <section aria-labelledby="titulo-confirmacion" className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
        <h2 id="titulo-confirmacion" className="text-2xl font-bold text-emerald-700">Cita agendada</h2>
        <p role="status" className="mt-2 text-slate-600">La cita de práctica se registró correctamente.</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><dt className="font-semibold">Paciente</dt><dd>{citaConfirmada.pacienteNombre}</dd></div>
          <div><dt className="font-semibold">Médico</dt><dd>{medico?.nombre} — {medico?.especialidad}</dd></div>
          <div><dt className="font-semibold">Fecha</dt><dd>{citaConfirmada.fecha}</dd></div>
          <div><dt className="font-semibold">Hora</dt><dd>{citaConfirmada.hora}</dd></div>
          <div><dt className="font-semibold">Urgencia</dt><dd>{citaConfirmada.urgencia === 'critica' ? 'Crítica' : citaConfirmada.urgencia}</dd></div>
          <div className="sm:col-span-2"><dt className="font-semibold">Motivo</dt><dd className="whitespace-pre-wrap break-words">{citaConfirmada.motivo}</dd></div>
        </dl>
        <button type="button" onClick={agendarOtraCita} className="mt-6 rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800">Agendar otra cita</button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit(agendarCita)} noValidate className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-6 text-sm text-slate-600">Completa los datos para agendar la cita. Todos los campos son obligatorios.</p>
      <fieldset disabled={isSubmitting} className="grid gap-5 sm:grid-cols-2 disabled:opacity-70">
        <legend className="sr-only">Datos de la nueva cita</legend>
        <div className="sm:col-span-2">
          <label htmlFor="pacienteNombre" className="text-sm font-semibold">Nombre del paciente</label>
          <input id="pacienteNombre" {...register('pacienteNombre')} autoComplete="name" aria-invalid={!!errors.pacienteNombre} aria-describedby={errors.pacienteNombre ? 'error-nombre' : undefined} className={claseCampo(!!errors.pacienteNombre)} />
          {errors.pacienteNombre && <p id="error-nombre" role="alert" className="mt-1 text-sm text-rose-600">{errors.pacienteNombre.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="medicoId" className="text-sm font-semibold">Médico</label>
          <select id="medicoId" {...register('medicoId')} disabled={cargando || isSubmitting} aria-invalid={!!errors.medicoId} aria-describedby={errors.medicoId ? 'error-medico' : undefined} className={claseCampo(!!errors.medicoId)}>
            {cargando ? <option value="" disabled>Cargando médicos...</option> : <option value="" disabled>Selecciona un médico</option>}
            {medicos.map(medico => <option key={medico.id} value={medico.id}>{medico.nombre} — {medico.especialidad}</option>)}
          </select>
          {errors.medicoId && <p id="error-medico" role="alert" className="mt-1 text-sm text-rose-600">{errors.medicoId.message}</p>}
        </div>
        <div>
          <label htmlFor="fecha" className="text-sm font-semibold">Fecha</label>
          <input id="fecha" type="date" min={fechaMinima} {...register('fecha')} aria-invalid={!!errors.fecha} aria-describedby={errors.fecha ? 'error-fecha' : undefined} className={claseCampo(!!errors.fecha)} />
          {errors.fecha && <p id="error-fecha" role="alert" className="mt-1 text-sm text-rose-600">{errors.fecha.message}</p>}
        </div>
        <div>
          <label htmlFor="hora" className="text-sm font-semibold">Hora</label>
          <input id="hora" type="time" {...register('hora')} aria-invalid={!!errors.hora} aria-describedby={errors.hora ? 'error-hora' : undefined} className={claseCampo(!!errors.hora)} />
          {errors.hora && <p id="error-hora" role="alert" className="mt-1 text-sm text-rose-600">{errors.hora.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="motivo" className="text-sm font-semibold">Motivo de la consulta</label>
          <textarea id="motivo" rows={4} {...register('motivo')} aria-invalid={!!errors.motivo} aria-describedby={errors.motivo ? 'error-motivo' : 'ayuda-motivo'} className={claseCampo(!!errors.motivo)} />
          <p id="ayuda-motivo" className="mt-1 text-xs text-slate-500">Entre 10 y 500 caracteres.</p>
          {errors.motivo && <p id="error-motivo" role="alert" className="mt-1 text-sm text-rose-600">{errors.motivo.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="urgencia" className="text-sm font-semibold">Urgencia</label>
          <select id="urgencia" {...register('urgencia')} aria-invalid={!!errors.urgencia} aria-describedby={errors.urgencia ? 'error-urgencia' : undefined} className={claseCampo(!!errors.urgencia)}>
            <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option><option value="critica">Crítica</option>
          </select>
          {errors.urgencia && <p id="error-urgencia" role="alert" className="mt-1 text-sm text-rose-600">{errors.urgencia.message}</p>}
        </div>
      </fieldset>
      <button type="submit" disabled={isSubmitting || cargando} className="mt-6 w-full rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {isSubmitting ? 'Agendando...' : 'Agendar cita'}
      </button>
    </form>
  );
}
