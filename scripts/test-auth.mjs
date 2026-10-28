import assert from "node:assert/strict";
import { createServer } from "vite";
const guardado = new Map();
const redirecciones = [];
globalThis.localStorage = {
  getItem: (key) => guardado.get(key) ?? null,
  setItem: (key, value) => guardado.set(key, value),
  removeItem: (key) => guardado.delete(key),
};
globalThis.window = {
  localStorage: globalThis.localStorage,
  location: { replace: (ruta) => redirecciones.push(ruta) },
};
const vite = await createServer({
  cacheDir: "node_modules/.vite-test-auth",
  server: { middlewareMode: true },
  appType: "custom",
});
let checks = 0;
const eq = (a, b) => {
  assert.deepEqual(a, b);
  checks++;
};
try {
  const { useAuthStore: auth } = await vite.ssrLoadModule(
    "/src/stores/authStore.ts",
  );
  const { api } = await vite.ssrLoadModule("/src/lib/axios.ts");
  const { login } = await vite.ssrLoadModule("/src/services/auth.ts");
  const { loginSchema } = await vite.ssrLoadModule(
    "/src/schemas/loginSchema.ts",
  );
  eq(
    loginSchema.safeParse({ email: "sin-formato", password: "123" }).success,
    false,
  );
  eq(
    loginSchema.safeParse({ email: "demo@example.test", password: "123456" })
      .success,
    true,
  );
  const usuario = {
    id: 1,
    nombre: "Cuenta ficticia",
    email: "demo@example.test",
    rol: "RECEPCIONISTA",
  };
  api.defaults.adapter = async (config) => ({
    data: { token: "token-de-prueba", usuario },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });
  const respuesta = await login({ email: usuario.email, password: "123456" });
  eq(respuesta.usuario.nombre, usuario.nombre);
  auth.getState().login(respuesta.token, respuesta.usuario);
  eq(auth.getState().isAuthenticated, true);
  const persistido = JSON.parse(guardado.get("auth-storage"));
  eq(persistido.state.token, "token-de-prueba");
  eq("password" in persistido.state, false);
  auth.setState({ token: null, usuario: null, isAuthenticated: false });
  guardado.set("auth-storage", JSON.stringify(persistido));
  await auth.persist.rehydrate();
  eq(auth.getState().token, "token-de-prueba");
  let authorization;
  api.defaults.adapter = async (config) => {
    authorization = config.headers.Authorization;
    return { data: [], status: 200, statusText: "OK", headers: {}, config };
  };
  await api.get("/pacientes");
  eq(authorization, "Bearer token-de-prueba");
  const axios = (await import("axios")).default;
  api.defaults.adapter = async (config) => {
    throw new axios.AxiosError(
      "Credenciales inválidas",
      "ERR_BAD_REQUEST",
      config,
      null,
      {
        data: { mensaje: "Credenciales inválidas" },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      },
    );
  };
  await assert.rejects(api.get("/pacientes"));
  checks++;
  eq(auth.getState().token, null);
  eq(auth.getState().usuario, null);
  eq(auth.getState().isAuthenticated, false);
  eq(redirecciones, ["/login"]);
  eq(JSON.parse(guardado.get("auth-storage")).state.token, null);
  const cantidad = redirecciones.length;
  await assert.rejects(login({ email: usuario.email, password: "incorrecta" }));
  checks++;
  eq(redirecciones.length, cantidad);
  auth.getState().login("otra-sesion", usuario);
  auth.getState().logout();
  eq(auth.getState().token, null);
  eq(JSON.parse(guardado.get("auth-storage")).state.usuario, null);
  console.log(
    "OK: " +
      checks +
      " comprobaciones de validación, servicio, persistencia, rehidratación, Bearer y logout por 401.",
  );
} finally {
  await vite.close();
  delete globalThis.window;
  delete globalThis.localStorage;
}
