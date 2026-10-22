import assert from "node:assert/strict";
import { createServer } from "vite";
const historial = new Map();
globalThis.window = {
  __REDUX_DEVTOOLS_EXTENSION__: {
    connect({ name }) {
      const acciones = [];
      historial.set(name, acciones);
      return {
        init() {
          acciones.push("@@INIT");
        },
        send(action) {
          acciones.push(action.type);
        },
        subscribe() {
          return () => {};
        },
        unsubscribe() {},
      };
    },
  },
  location: { href: "" },
};
globalThis.localStorage = { getItem: () => null };
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
let checks = 0;
const eq = (actual, esperado) => {
  assert.deepEqual(actual, esperado);
  checks++;
};
try {
  const { api } = await vite.ssrLoadModule("/src/lib/axios.ts");
  const { usePacientesStore: pacientes } = await vite.ssrLoadModule(
    "/src/stores/pacientesStore.ts",
  );
  const { useCitasStore: citas } = await vite.ssrLoadModule(
    "/src/stores/citasStore.ts",
  );
  const { useFiltrosStore: filtros } = await vite.ssrLoadModule(
    "/src/stores/filtrosStore.ts",
  );
  let llamadas = 0;
  const paciente = {
    id: 900,
    nombre: "Prueba",
    apellido: "Zustand",
    email: "zustand@example.test",
    telefono: null,
    fechaNacimiento: "1990-01-01",
  };
  const cita = {
    id: 700,
    pacienteId: 900,
    medicoId: 2,
    estado: "PROGRAMADA",
    fecha: "2036-06-10T16:00:00Z",
    motivo: "Prueba ficticia",
  };
  let responder = (config) =>
    config.url === "/pacientes"
      ? { data: [paciente], total: 1 }
      : config.url === "/pacientes/900"
        ? { citas: [cita] }
        : [cita];
  api.defaults.adapter = async (config) => {
    llamadas++;
    return {
      data: await responder(config),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  await pacientes.getState().cargar("Prueba");
  eq(pacientes.getState().pacientes[0].id, "900");
  eq(pacientes.getState().total, 1);
  eq(pacientes.getState().cargando, false);
  responder = (config) => {
    eq(config.params.query, "consulta");
    return [paciente];
  };
  await pacientes.getState().cargar("consulta");
  responder = () => ({ paciente: { ...paciente, id: 901 } });
  await pacientes
    .getState()
    .crear({
      nombre: "Prueba",
      apellido: "Zustand",
      email: "zustand@example.test",
      fechaNacimiento: "1990-01-01",
    });
  eq(pacientes.getState().total, 2);
  responder = () => ({ ...paciente, nombre: "Editado" });
  await pacientes.getState().actualizar(900, { nombre: "Editado" });
  eq(pacientes.getState().pacientes[0].nombre, "Editado");
  responder = () => {
    throw new Error("Fallo controlado");
  };
  await assert.rejects(pacientes.getState().eliminar(900));
  checks++;
  eq(pacientes.getState().pacientes.length, 2);
  eq(pacientes.getState().error, "Fallo controlado");
  responder = () => null;
  await pacientes.getState().eliminar(901);
  eq(pacientes.getState().pacientes.length, 1);
  eq(pacientes.getState().total, 1);
  let terminarPrimera;
  responder = () =>
    new Promise((resolve) => {
      terminarPrimera = resolve;
    });
  const primera = pacientes.getState().cargar();
  await new Promise((resolve) => setImmediate(resolve));
  responder = () => [{ ...paciente, nombre: "Última consulta" }];
  await pacientes.getState().cargar();
  terminarPrimera([paciente]);
  await primera;
  eq(pacientes.getState().pacientes[0].nombre, "Última consulta");
  responder = () => ({ citas: [cita] });
  await citas.getState().cargarPorPaciente(900);
  eq(citas.getState().citas.length, 1);
  const antes = llamadas;
  citas.getState().seleccionar(700);
  eq(llamadas, antes);
  eq(citas.getState().citaSeleccionada.id, 700);
  responder = () => ({ ...cita, estado: "COMPLETADA" });
  await citas.getState().actualizarEstado(700, "COMPLETADA");
  eq(citas.getState().citaSeleccionada.estado, "COMPLETADA");
  eq(citas.getState().citas[0].estado, "COMPLETADA");
  responder = () => {
    throw new Error("Fallo PATCH");
  };
  await assert.rejects(citas.getState().actualizarEstado(700, "CANCELADA"));
  checks++;
  eq(citas.getState().citas[0].estado, "COMPLETADA");
  citas.getState().seleccionar(999);
  eq(citas.getState().citaSeleccionada, null);
  responder = () => ({ ...cita, id: 701 });
  await citas
    .getState()
    .agregarCita({ pacienteId: 900, medicoId: 2, fecha: cita.fecha });
  eq(citas.getState().citas.length, 2);
  filtros.getState().setQueryPacientes("Prueba");
  filtros.getState().setEspecialidad("Todas");
  filtros.getState().setEstadoCita("COMPLETADA");
  eq(filtros.getState().queryPacientes, "Prueba");
  eq(filtros.getState().estadoCitaFiltro, "COMPLETADA");
  filtros.getState().resetFiltros();
  eq(filtros.getState().queryPacientes, "");
  eq(filtros.getState().estadoCitaFiltro, "Todos");
  for (const [nombre, acciones] of historial) {
    assert(acciones.length > 1, nombre);
    assert(!acciones.includes("anonymous"));
    checks++;
  }
  eq([...historial.keys()], ["PacientesStore", "CitasStore", "FiltrosStore"]);
  console.log(
    "OK: " +
      checks +
      " comprobaciones. CRUD, concurrencia, selección sin HTTP y acciones DevTools con nombre.",
  );
  for (const [nombre, acciones] of historial)
    console.log(nombre + ": " + acciones.join(" → "));
} finally {
  await vite.close();
  delete globalThis.window;
  delete globalThis.localStorage;
}
