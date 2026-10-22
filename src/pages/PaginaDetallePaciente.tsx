import { useNavigate, useParams } from "react-router-dom";
import { usePacientesStore } from "../stores/pacientesStore";
import { useCitasStore } from "../stores/citasStore";
import { useEffect } from "react";
import Cargando from "../components/Cargando";
import BadgeEstado from "../components/BadgeEstado";
import PaginaNotFound from "./PaginaNotFound";

export default function PaginaDetallePaciente() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const citas = useCitasStore((s) => s.citas);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const cargar = useCitasStore((s) => s.cargarPorPaciente);
  const seleccionar = useCitasStore((s) => s.seleccionar);
  const seleccionada = useCitasStore((s) => s.citaSeleccionada);
  // Buscar el paciente con el ID de la URL.
  const { id } = useParams();
  const navigate = useNavigate();
  const paciente = pacientes.find((paciente) => paciente.id === id);

  useEffect(() => {
    if (id) void cargar(Number(id));
  }, [id, cargar]);
  // Mostrar 404 si el paciente no existe.
  if (!paciente) return <PaginaNotFound />;

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
      >
        ← Volver
      </button>
      <h1 className="text-3xl font-bold">Detalle del paciente</h1>
      <section
        aria-labelledby="nombre-paciente"
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="nombre-paciente" className="text-2xl font-bold">
            {paciente.nombre} {paciente.apellido}
          </h2>
          <BadgeEstado estado={paciente.estado} />
        </div>
        <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-500">ID</dt>
            <dd className="mt-1 break-all">{paciente.id}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Nombre</dt>
            <dd className="mt-1">{paciente.nombre}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Apellido</dt>
            <dd className="mt-1">{paciente.apellido || "Sin registrar"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Correo electrónico</dt>
            <dd className="mt-1 break-all">{paciente.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Teléfono</dt>
            <dd className="mt-1">{paciente.telefono}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">
              Especialidad asignada
            </dt>
            <dd className="mt-1">{paciente.especialidadAsignada}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Última cita</dt>
            <dd className="mt-1">
              {paciente.ultimaCita ? (
                <time dateTime={paciente.ultimaCita}>
                  {paciente.ultimaCita}
                </time>
              ) : (
                "Sin información"
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Estado</dt>
            <dd className="mt-1">
              <BadgeEstado estado={paciente.estado} />
            </dd>
          </div>
        </dl>
      </section>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">Citas del paciente</h2>
        {cargando ? (
          <Cargando />
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          citas.map((cita) => (
            <button
              key={cita.id}
              onClick={() => seleccionar(cita.id)}
              className="m-2 rounded-lg border p-3"
            >
              Cita #{cita.id} · {cita.estado}
            </button>
          ))
        )}
        {!cargando && !error && citas.length === 0 && (
          <p>No hay citas registradas.</p>
        )}
        {seleccionada && (
          <p role="status">
            Cita #{seleccionada.id}:{" "}
            {seleccionada.motivo || "Sin motivo registrado"}
          </p>
        )}
      </section>
    </main>
  );
}
