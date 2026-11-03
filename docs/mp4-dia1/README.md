# MP4 — Día 1: despliegue en Vercel

## Código listo

- `vercel.json`: framework Vite, `npm run build`, salida `dist` y rewrite de todas las rutas SPA a `/index.html`.
- `src/vite-env.d.ts`: `VITE_API_URL: string` y `strictImportMetaEnv`, para rechazar errores en nombres de variables.
- `.gitignore`: excluye `.env`, `.env.*` y `.vercel/`; conserva `.env.example` como plantilla sin secretos.
- Validación de build en Vercel: exige una URL HTTPS pública para la API y rechaza localhost.
- Carga diferida de Perfil y Reportes; el build local pasa sin advertencias de tamaño.
- ErrorBoundary por sección, incluido el login, y skeletons durante la carga diferida.

## Validación realizada

`npm run build`, `npm run lint`, pruebas auth, rutas, perfil y mp3, y `node scripts/test-deploy.mjs` pasan. La prueba de deploy genera deliberadamente errores para verificar que se rechazan URLs inválidas y confirma que un typo de `VITE_API_URL` falla en TypeScript.

## Estado real del despliegue

**Pendiente. No existe todavía una URL ni una captura de esta versión desplegada en Vercel.**

La CLI de Vercel no tenía sesión. El navegador mostró la cuenta GitHub `demr-tech`, que es distinta de la cuenta solicitada `dariomartinez2014`; se canceló la autorización de esa cuenta.

La configuración local de la Clínica apunta a `http://localhost:5195/api`. No se encontró una URL de backend público en los metadatos de despliegue de los repositorios consultados. El backend local solo permite orígenes locales en CORS. Esto no demuestra que no exista otro despliegue; hay que localizarlo o publicarlo desde la cuenta correcta.

## Finalizar

1. Iniciar sesión de GitHub como `dariomartinez2014` y autorizar la CLI de Vercel con esa cuenta.
2. Localizar o publicar el backend real y comprobar `/api/health` mediante HTTPS. Configurar en su CORS el origen exacto de la web de Vercel; no usar una URL inventada ni un túnel local como producción.
3. Importar `clinica-frontend` en Vercel. Framework: Vite; build: `npm run build`; output: `dist`.
4. Añadir `VITE_API_URL` en Production con la URL real del backend, incluyendo `/api` si corresponde. La variable es pública en el navegador: no guardar en ella claves ni tokens.
5. Desplegar la rama `feat/mp4-dia1-deploy` mediante `vercel --prod` o la integración Git.
6. Abrir `/login`, iniciar sesión contra el backend real y refrescar `/pacientes`; debe cargar la SPA y conservar la sesión sin 404.
7. Adjuntar al PR la URL de Vercel y una captura real de producción. Pasar el PR de borrador a listo para revisión solo después de comprobar esos puntos.

El PR contiene la base del MP3 todavía pendiente de integración en el PR #13; no se modificó ni fusionó `main`.

Referencias oficiales: [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite), [variables de entorno de Vite](https://vite.dev/guide/env-and-mode).
