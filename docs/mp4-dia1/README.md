# MP4 — Día 1: despliegue en Vercel

Publica la Clínica con React/Vite en Vercel, conectada a una API Express/Prisma y una base Neon separada con datos ficticios.

- App: https://clinica-funval-mp4-demr.vercel.app
- API: https://clinica-funval-api-demr.vercel.app/api/health
- Rewrite SPA, VITE_API_URL tipada y validada en producción, archivos de entorno excluidos y Error Boundaries por sección.
- Build y lint sin errores; pruebas de auth, rutas, perfil, MP3 y configuración de deploy aprobadas.
- Verificado en producción: login contra la API, dashboard con datos, /pacientes con 14 registros y recarga directa conservando sesión sin 404.

![Pacientes en producción](https://raw.githubusercontent.com/dariomartinez2014/clinica-frontend/feat/mp4-dia1-deploy/docs/mp4-dia1/produccion-pacientes.png)

Desplegado mediante Vercel CLI con el equipo dariomartinez2014. Los siguientes despliegues se realizan con `vercel --prod`; no quedó conectada la integración automática de GitHub. Credenciales de demostración entregadas localmente, fuera del repositorio.

Incluye la base del MP3 del PR #13, aún abierto. No se fusionó main automáticamente.

## Configuración

Frontend: Vite, instalación `npm ci --include=dev`, build `npm run build`, salida `dist`. `vercel.json` sirve index.html en rutas SPA. `src/vite-env.d.ts` declara VITE_API_URL y rechaza nombres incorrectos. El build de Vercel exige API HTTPS pública.

Variable pública de producción: `VITE_API_URL=https://clinica-funval-api-demr.vercel.app/api`.

Backend: Express en Node 24, Prisma y Postgres Neon. DATABASE_URL y JWT_SECRET se guardan como secretos de Vercel. UPLOAD_STORAGE=database conserva las fotos entre invocaciones; CORS_ALLOWED_ORIGINS contiene el origen exacto del frontend. Migraciones y demo aplicadas primero en rama de validación y después en production con autorización.

## Verificación

El 3 de noviembre de 2026: API health devolvió estado ok y baseDeDatos conectada; login real con usuario ficticio de recepción; dashboard mostró 14 pacientes; navegación a /pacientes y recarga completa mantuvieron sesión sin 404. Captura adjunta obtenida después de recargar.

Validaciones locales: build, lint, auth, rutas, perfil, mp3 y test-deploy. Este último provoca errores controlados para confirmar que se rechazan localhost y typos de entorno. Perfil API: 20 comprobaciones de login y archivos aprobadas en la base de validación.

## Repetir despliegue

En la carpeta del frontend, con la CLI autenticada y el proyecto vinculado: `npx vercel --prod --yes --scope dariomartinez2014`. Las variables permanecen configuradas en Vercel. No subir archivos .env, .vercel o contraseñas. No es necesario mantener la computadora local encendida.
