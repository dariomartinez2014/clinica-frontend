import * as React from "react";
import { renderToString } from "react-dom/server";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { api } = await vite.ssrLoadModule("/src/lib/axios.ts");
  const { useDashboardStore: store } = await vite.ssrLoadModule("/src/stores/dashboardStore.ts");
  const { default: Spinner } = await vite.ssrLoadModule("/src/shared/components/Spinner.tsx");
  let totals = [25, 4, 3, 6, 10];
  let calls = 0;
  api.defaults.adapter = async config => {
    calls++;
    const index = config.url === "/pacientes" ? 0 : config.url === "/medicos" ? 1
      : config.params?.estado === "Programada" ? 2 : config.params?.estado === "Completada" ? 3 : 4;
    return { data: { data: [], total: totals[index] }, status: 200, statusText: "OK", headers: {}, config };
  };
  await store.getState().cargar();
  assert.deepEqual(store.getState().totales, totals);
  assert.equal(store.getState().totales[3] / store.getState().totales[4], 0.6);
  totals = [26, 4, 2, 7, 10];
  await store.getState().cargar();
  assert.deepEqual(store.getState().totales, totals);
  totals = [0, 0, 0, 0, 0];
  await store.getState().cargar();
  assert.deepEqual(store.getState().totales, [0, 0, 0, 0, 0]);
  assert.equal(calls, 15);
  api.defaults.adapter = async () => { throw new Error("API no disponible"); };
  await store.getState().cargar();
  assert.equal(store.getState().cargando, false);
  assert.ok(store.getState().error);
  const inline = renderToString(React.createElement(Spinner));
  const fullscreen = renderToString(React.createElement(Spinner, { fullscreen: true }));
  assert.match(inline, /role="status"/);
  assert.doesNotMatch(inline, /min-h-screen/);
  assert.match(fullscreen, /min-h-screen/);
  // El grafo inicial del build no debe incluir las páginas diferidas.
  const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
  const entry = Object.values(manifest).find(chunk => chunk.isEntry);
  assert.ok(entry);
  const initialFiles = new Set();
  function collectStatic(chunk) {
    initialFiles.add(chunk.file);
    for (const key of chunk.imports ?? []) {
      if (!initialFiles.has(manifest[key].file)) collectStatic(manifest[key]);
    }
  }
  collectStatic(entry);
  for (const name of ["PaginaPacientes", "PaginaDetallePaciente", "PaginaReportes", "PaginaCitas", "PaginaNuevaCita", "PaginaSinAcceso", "PaginaNotFound"]) {
    const chunk = manifest[`src/pages/${name}.tsx`];
    assert.ok(chunk?.isDynamicEntry, `${name} debe ser un chunk dinámico`);
    assert.ok(!initialFiles.has(chunk.file), `${name} no debe descargarse al inicio`);
  }

  console.log("OK: carga y actualización de métricas, cero citas, error de API, Spinner y siete chunks fuera de la descarga inicial.");
} finally {
  await vite.close();
}
