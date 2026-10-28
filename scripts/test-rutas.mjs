import assert from "node:assert/strict";
import { createServer } from "vite";

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};
globalThis.window = { localStorage: globalThis.localStorage };
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
let checks = 0;
try {
  const React = (await import("react")).default;
  const { renderToString } = await import("react-dom/server");
  const { MemoryRouter, Routes, Route } = await import("react-router-dom");
  const { default: Guard } = await vite.ssrLoadModule("/src/components/RutaProtegida.tsx");
  const { default: Denied } = await vite.ssrLoadModule("/src/pages/PaginaSinAcceso.tsx");
  const { default: Layout } = await vite.ssrLoadModule("/src/components/Layout.tsx");
  const { useAuthStore: auth } = await vite.ssrLoadModule("/src/stores/authStore.ts");
  // SSR normalmente lee el estado inicial; aquí cada escenario define su sesión.
  const initialSnapshot = auth.getInitialState();
  const h = React.createElement;
  const user = rol => ({ id: 1, nombre: "Persona de prueba", email: "prueba@example.test", rol });
  const page = (allowed) => { Object.assign(initialSnapshot, auth.getState()); return renderToString(h(MemoryRouter, { initialEntries: ["/privada"] },
    h(Routes, null, h(Route, { element: h(Guard, { rolesPermitidos: allowed }) },
      h(Route, { path: "/privada", element: h("p", null, "CONTENIDO PRIVADO") }))))); };
  const check = (condition, label) => { assert.ok(condition, label); checks++; };
  auth.getState().logout();
  check(!page().includes("CONTENIDO PRIVADO"), "Sin sesión no renderiza contenido");
  for (const role of ["RECEPCIONISTA", "GERENCIA", "ADMIN"]) {
    auth.getState().login("token-ficticio", user(role));
    check(page().includes("CONTENIDO PRIVADO"), `${role} accede a rutas generales`);
    check(page(["GERENCIA", "ADMIN"]).includes("CONTENIDO PRIVADO") === (role !== "RECEPCIONISTA"), `Permiso de reportes para ${role}`);
  }
  auth.getState().login("token-ficticio", user("ADMIN"));
  check(!page([]).includes("CONTENIDO PRIVADO"), "Lista vacía no autoriza roles");
  auth.setState({ usuario: null });
  check(!page().includes("CONTENIDO PRIVADO"), "Una sesión incompleta no entra");
  auth.getState().login("token-ficticio", user("RECEPCIONISTA"));
  const denied = renderToString(h(MemoryRouter, null, h(Denied)));
  check(denied.includes("No tienes acceso a esta sección"), "Explica la falta de permiso");
  check(denied.includes('href="/"'), "Ofrece volver al inicio");
  Object.assign(initialSnapshot, auth.getState());
  const layout = renderToString(h(MemoryRouter, null, h(Layout)));
  check(layout.includes("Persona de prueba") && layout.includes("RECEPCIONISTA") && layout.includes("Cerrar sesión"), "Header muestra nombre, rol y logout");
  auth.getState().logout();
  check(!auth.getState().isAuthenticated && !auth.getState().token && !auth.getState().usuario, "Logout limpia la sesión");
  console.log(`OK: ${checks} comprobaciones de guards, roles, acceso denegado y sesión.`);
} finally {
  await vite.close();
  delete globalThis.window;
  delete globalThis.localStorage;
}
