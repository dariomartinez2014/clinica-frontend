import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const vite = await createServer({ cacheDir: "node_modules/.vite-test-mp3", server: { middlewareMode: true }, appType: "custom" });
try {
 const { paginarCitas } = await vite.ssrLoadModule("/src/lib/historial.ts");
 const citas = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, estado: i % 2 ? "PROGRAMADA" : "COMPLETADA", fecha: `2026-10-${String(i + 1).padStart(2, "0")}T12:00:00Z` }));
 const original = JSON.stringify(citas);
 const primera = paginarCitas(citas, "Todos", 1); const segunda = paginarCitas(citas, "Todos", 2);
 assert.equal(primera.citas.length, 6); assert.equal(primera.totalPaginas, 3);
 assert.ok(segunda.citas.every(c => !primera.citas.some(p => p.id === c.id)));
 assert.equal(paginarCitas(citas, "Todos", 999).pagina, 3);
 assert.equal(paginarCitas(citas, "Todos", NaN).pagina, 1);
 assert.equal(paginarCitas(citas, "Todos", -4).pagina, 1);
 assert.equal(paginarCitas(citas, "COMPLETADA", 2).citas.length, 2);
 assert.equal(paginarCitas([], "Todos", 1).total, 0);
 assert.equal(JSON.stringify(citas), original);
 const h = React.createElement;
 const { default: Alerta } = await vite.ssrLoadModule("/src/shared/components/ui/AlertaBanner.tsx");
 for (const tipo of ["info", "exito", "advertencia", "error"]) {
  const html = renderToStaticMarkup(h(Alerta, { tipo, mensaje: "Aviso" }));
  assert.ok(html.includes(tipo === "error" ? 'role="alert"' : 'role="status"'));
 }
 const { default: Spinner } = await vite.ssrLoadModule("/src/shared/components/ui/Spinner.tsx");
 assert.ok(renderToStaticMarkup(h(Spinner, { fullscreen: true })).includes("fixed inset-0"));
 assert.ok(!renderToStaticMarkup(h(Spinner)).includes("fixed inset-0"));
 const { default: Vacio } = await vite.ssrLoadModule("/src/shared/components/ui/EstadoVacio.tsx");
 assert.ok(renderToStaticMarkup(h(Vacio, { titulo: "Sin datos", accion: { label: "Crear", onClick() {} } })).includes("Crear"));
 const { default: Modal } = await vite.ssrLoadModule("/src/shared/components/ui/ModalConfirmacion.tsx");
 const modal = renderToStaticMarkup(h(Modal, { titulo: "Confirmar", mensaje: "Mensaje", cargando: true, onCancelar() {}, onConfirmar() {} }));
 assert.equal((modal.match(/disabled=""/g) ?? []).length, 2);
 assert.ok(modal.includes('aria-busy="true"'));
 console.log("OK: paginación, filtros antes de paginar, límites, inmutabilidad, alertas, spinner fullscreen, estado vacío y modal bloqueado.");
} finally { await vite.close(); }
