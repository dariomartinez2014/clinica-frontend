// QA local con HTTP real y datos ficticios. Nunca se incluye en producción.
import { createServer } from "vite";
process.env.VITE_API_URL = "/__qa/api";
const token = "mp3-token-ficticio-solo-qa";
const usuario = { id: 1, nombre: "Cuenta de prueba MP3", email: "mp3@example.test", telefono: "55551234", rol: "ADMIN", foto: null };
const pacientes = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, nombre: `Paciente de prueba ${i + 1}`, apellido: "MP3", email: `paciente${i + 1}@example.test`, telefono: "55551234", fechaNacimiento: "1995-01-01", estado: "activo", especialidadAsignada: "Medicina general" }));
const citas = Array.from({ length: 19 }, (_, i) => ({ id: i + 1, pacienteId: 1, medicoId: 1, fecha: `2026-10-${String(10 + i).padStart(2, "0")}T15:00:00Z`, motivo: "Consulta de prueba MP3", estado: i % 3 ? "PROGRAMADA" : "COMPLETADA" }));
const peticiones = [];
const escapar = valor => String(valor).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const server = await createServer({
 cacheDir: "node_modules/.vite-qa-mp3",
 server: { host: "127.0.0.1", port: 5186, strictPort: true },
 plugins: [{ name: "qa-mp3", enforce: "pre",
  transform(code, id) {
   if (id.replaceAll("\\", "/").endsWith("/src/pages/PaginaReportes.tsx")) return code.replace("export default function PaginaReportes() {", 'export default function PaginaReportes() { if (new URLSearchParams(window.location.search).get("qaError") === "1") throw new Error("Error intencional y aislado de QA");');
  },
  transformIndexHtml(html) {
   return html.replace("</body>", `<script type="module">const bar=document.createElement('aside');bar.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#0f172a;color:white;padding:8px 14px;font:12px monospace;overflow-wrap:anywhere';document.body.append(bar);setInterval(()=>{bar.textContent='QA · Datos ficticios · '+location.href},250);</script></body>`);
  },
  configureServer(vite) {
   vite.middlewares.use(async (req, res, next) => {
    const url = new URL(req.url, "http://127.0.0.1:5186");
    if (url.pathname === "/__qa/network") {
     res.setHeader("Content-Type", "text/html; charset=utf-8");
     res.end(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Evidencia HTTP de QA MP3</title><style>body{font:16px system-ui;margin:40px;color:#0f172a;background:#f1f5f9}main{background:white;padding:30px;border-radius:16px}pre{white-space:pre-wrap;background:#f8fafc;padding:20px}li{margin:15px}</style><main><h1>Registro HTTP local · MP3</h1><p>Datos y token ficticios. Peticiones recibidas realmente por el middleware de QA.</p><p>Este registro no es una captura de Chrome DevTools.</p><ul>${peticiones.slice(-8).map(p => `<li><strong>${escapar(p.metodo)} ${escapar(p.url)}</strong><pre>Authorization: ${escapar(p.authorization || "Sin token")}<br>Status: ${p.status}</pre></li>`).join("")}</ul><a href="/">Volver a la clínica</a></main></html>`); return;
    }
    if (!url.pathname.startsWith("/__qa/api/")) return next();
    const path = url.pathname.slice("/__qa/api".length);
    const partes = []; for await (const chunk of req) partes.push(chunk);
    let body = {}; try { body = JSON.parse(Buffer.concat(partes).toString()); } catch { /* Multipart: no registrar sus valores. */ }
    let data; let status = 200;
    if (path === "/auth/login") {
     if (![usuario.email, "recepcion@example.test"].includes(body.email) || body.password !== "ClaseMP3!2026") { status = 401; data = { mensaje: "Credenciales de prueba incorrectas" }; }
     else data = { token, usuario: { ...usuario, rol: body.email === "recepcion@example.test" ? "RECEPCIONISTA" : "ADMIN" } };
    } else if (req.headers.authorization !== `Bearer ${token}`) { status = 401; data = { mensaje: "Sesión requerida" }; }
    else if (path === "/auth/perfil") data = { ...usuario };
    else if (path === "/medicos") data = [{ id: 1, nombre: "Médico de prueba", especialidad: "Medicina general" }];
    else if (path === "/reportes/especialidades") data = [{ especialidad: "Medicina general", total: 19 }];
    else if (path === "/pacientes") {
     const query = (url.searchParams.get("query") ?? "").toLowerCase();
     const filtrados = pacientes.filter(p => p.nombre.toLowerCase().includes(query));
     const pagina = Number(url.searchParams.get("pagina") ?? 1); const limite = Number(url.searchParams.get("limite") ?? 12);
     data = { data: filtrados.slice((pagina - 1) * limite, pagina * limite), total: filtrados.length, pagina, totalPaginas: Math.max(1, Math.ceil(filtrados.length / limite)) };
    } else if (/^\/pacientes\/\d+$/.test(path)) data = { ...pacientes[0], citas: Number(path.split("/").at(-1)) === 2 ? [] : citas };
    else if (path === "/citas" || /medicos\/\d+\/citas/.test(path)) data = citas;
    else { status = 404; data = { mensaje: "Ruta de QA no definida" }; }
    peticiones.push({ metodo: req.method, url: path + url.search, authorization: req.headers.authorization, status });
    if (req.method === "GET") await new Promise(resolve => setTimeout(resolve, 2200));
    res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(data));
   });
  },
 }],
});
await server.listen();
console.log("QA MP3: http://127.0.0.1:5186 — cuenta ficticia mp3@example.test / ClaseMP3!2026");

