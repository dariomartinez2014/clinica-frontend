// Servidor de QA aislado: no se incluye en el build ni consulta datos reales.
import { createServer } from "vite";

const server = await createServer({
  cacheDir: "node_modules/.vite-qa-rutas",
  server: { host: "127.0.0.1", port: 5180, strictPort: true },
  plugins: [{
    name: "qa-rutas",
    enforce: "pre",
    transform(code, id) {
      if (!id.replaceAll("\\", "/").endsWith("/src/lib/axios.ts")) return;
      return code + `\napi.defaults.adapter = async config => ({data: [], status: 200, statusText: 'OK', headers: {}, config});`;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace('<div id="root">', `<script>
          const role = new URLSearchParams(location.search).get('qaRol');
          if (role === 'SIN_SESION') localStorage.removeItem('auth-storage');
          else if (['RECEPCIONISTA','GERENCIA','ADMIN'].includes(role)) localStorage.setItem('auth-storage', JSON.stringify({state:{token:'token-ficticio-qa',usuario:{id:1,nombre:'Cuenta de prueba '+role,email:'qa@example.test',rol:role},isAuthenticated:true},version:0}));
        </script><div id="root">`);
      },
    },
  }],
});
await server.listen();
console.log("QA aislado: http://127.0.0.1:5180 — sesiones y datos ficticios para verificar rutas.");
