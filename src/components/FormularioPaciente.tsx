import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { pacienteSchema } from "../schemas/pacienteSchema";
import type { PacienteFormData } from "../schemas/pacienteSchema";
import type { Paciente } from "../types/paciente";
import { usePacientesStore } from "../stores/pacientesStore";

import { extraerMensajeError } from "../lib/errorHandler";

interface Props {
  paciente?: Paciente;
  onGuardar: () => void;
  onCancelar?: () => void;
}

export default function FormularioPaciente({
  paciente,
  onGuardar,
  onCancelar,
}: Props) {
  const crear = usePacientesStore((s) => s.crear);
  const actualizar = usePacientesStore((s) => s.actualizar);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: paciente?.nombre ?? "",
      apellido: paciente?.apellido ?? "",
      email: paciente?.email ?? "",
      telefono:
        paciente?.telefono === "Sin registrar"
          ? ""
          : (paciente?.telefono ?? ""),
      fechaNacimiento: paciente?.fechaNacimiento ?? "",
    },
  });
  async function guardar(datos: PacienteFormData) {
    try {
      const dto = { ...datos, telefono: datos.telefono || undefined };
      if (paciente) await actualizar(Number(paciente.id), dto);
      else await crear(dto);
      onGuardar();
      toast.success(paciente ? "Paciente actualizado" : "Paciente registrado");
      if (!paciente) reset();
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  }
  const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2";
  const campos: {
    name: keyof PacienteFormData;
    label: string;
    type: string;
  }[] = [
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "telefono", label: "Teléfono (opcional)", type: "tel" },
    { name: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
  ];
  return (
    <form
      onSubmit={handleSubmit(guardar)}
      noValidate
      className="mb-6 rounded-xl border border-slate-200 bg-white p-5"
    >
      <h2 className="mb-4 text-lg font-bold">
        {paciente ? "Editar paciente" : "Agregar paciente"}
      </h2>
      <fieldset
        disabled={isSubmitting}
        className="grid gap-4 md:grid-cols-2 disabled:opacity-70"
      >
        <legend className="sr-only">Datos del paciente</legend>
        {campos.map((campo) => (
          <div key={campo.name}>
            <label htmlFor={`paciente-${campo.name}`}>{campo.label}</label>
            <input
              id={`paciente-${campo.name}`}
              type={campo.type}
              {...register(campo.name)}
              className={inputClass}
              aria-invalid={!!errors[campo.name]}
              aria-describedby={
                errors[campo.name] ? `error-${campo.name}` : undefined
              }
            />
            {errors[campo.name] && (
              <p
                id={`error-${campo.name}`}
                role="alert"
                className="mt-1 text-sm text-red-700"
              >
                {errors[campo.name]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting
            ? "Guardando..."
            : paciente
              ? "Guardar cambios"
              : "Registrar paciente"}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2"
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
