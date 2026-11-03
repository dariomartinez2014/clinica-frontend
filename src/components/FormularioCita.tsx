import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { citaSchema } from "../schemas/citaSchema";
import type { CitaFormData } from "../schemas/citaSchema";
import { useMedicos } from "../hooks/useMedicos";
import { usePacientes } from "../features/pacientes/hooks/usePacientes";
import { useCitas } from "../features/citas/hooks/useCitas";

import { extraerMensajeError } from "../lib/errorHandler";

import { SkeletonFormulario } from "../shared/components/ui/Skeletons";

export default function FormularioCita() {
  const {
    medicos,
    cargando: cargandoMedicos,
    error: errorMedicos,
    reintentar,
  } = useMedicos();
  // El hook carga las opciones completas; el formulario solo registra la cita.
  const { pacientes, cargando, error, cargar } = usePacientes({ todos: true });
  const { agregarCita } = useCitas();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteId: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
    },
  });
  async function guardar(datos: CitaFormData) {
    try {
      await agregarCita({
        pacienteId: Number(datos.pacienteId),
        medicoId: Number(datos.medicoId),
        fecha: new Date(`${datos.fecha}T${datos.hora}:00`).toISOString(),
        motivo: datos.motivo,
      });
      toast.success("Cita registrada");
      reset();
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  }
  if (cargando || cargandoMedicos) return <SkeletonFormulario />;
  if (error || errorMedicos)
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-5 text-red-800">
        <p>No se pudieron cargar las opciones: {error || errorMedicos}</p>
        <button
          onClick={() => {
            void cargar();
            reintentar();
          }}
          className="mt-3 rounded-lg border border-red-300 px-4 py-2"
        >
          Reintentar
        </button>
      </div>
    );
  const campo =
    "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
  return (
    <form
      onSubmit={handleSubmit(guardar)}
      noValidate
      className="rounded-xl border border-slate-200 bg-white p-6"
    >
      <fieldset
        disabled={isSubmitting}
        className="grid gap-5 sm:grid-cols-2 disabled:opacity-60"
      >
        <legend className="sr-only">Datos de la cita</legend>
        <div className="sm:col-span-2">
          <label htmlFor="cita-paciente">Paciente</label>
          <select
            id="cita-paciente"
            {...register("pacienteId")}
            className={campo}
            aria-invalid={!!errors.pacienteId}
          >
            <option value="">Selecciona un paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellido}
              </option>
            ))}
          </select>
          {errors.pacienteId && (
            <p role="alert" className="text-sm text-red-700">
              {errors.pacienteId.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cita-medico">MÃ©dico</label>
          <select
            id="cita-medico"
            {...register("medicoId")}
            className={campo}
            aria-invalid={!!errors.medicoId}
          >
            <option value="">Selecciona un mÃ©dico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} â€” {m.especialidad} (ID {m.id})
              </option>
            ))}
          </select>
          {errors.medicoId && (
            <p role="alert" className="text-sm text-red-700">
              {errors.medicoId.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cita-fecha">Fecha</label>
          <input
            id="cita-fecha"
            type="date"
            {...register("fecha")}
            className={campo}
            aria-invalid={!!errors.fecha}
          />
          {errors.fecha && (
            <p role="alert" className="text-sm text-red-700">
              {errors.fecha.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cita-hora">Hora</label>
          <input
            id="cita-hora"
            type="time"
            {...register("hora")}
            className={campo}
            aria-invalid={!!errors.hora}
          />
          {errors.hora && (
            <p role="alert" className="text-sm text-red-700">
              {errors.hora.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cita-motivo">Motivo de consulta</label>
          <textarea
            id="cita-motivo"
            rows={4}
            {...register("motivo")}
            className={campo}
            aria-invalid={!!errors.motivo}
          />
          {errors.motivo && (
            <p role="alert" className="text-sm text-red-700">
              {errors.motivo.message}
            </p>
          )}
        </div>
      </fieldset>
      {(!pacientes.length || !medicos.length) && (
        <p className="mt-4 text-amber-800">
          Necesitas al menos un paciente y un mÃ©dico registrados.
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !pacientes.length || !medicos.length}
        className="mt-6 rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Agendando..." : "Agendar cita"}
      </button>
    </form>
  );
}
