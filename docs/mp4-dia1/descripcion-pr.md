Publica la Clínica con React/Vite en Vercel, conectada a una API Express/Prisma y una base Neon separada con datos ficticios.

- App: https://clinica-funval-mp4-demr.vercel.app
- API: https://clinica-funval-api-demr.vercel.app/api/health
- Rewrite SPA, VITE_API_URL tipada y validada en producción, archivos de entorno excluidos y Error Boundaries por sección.
- Build y lint sin errores; pruebas de auth, rutas, perfil, MP3 y configuración de deploy aprobadas.
- Verificado en producción: login contra la API, dashboard con datos, /pacientes con 14 registros y recarga directa conservando sesión sin 404.

![Pacientes en producción](https://raw.githubusercontent.com/dariomartinez2014/clinica-frontend/feat/mp4-dia1-deploy/docs/mp4-dia1/produccion-pacientes.png)

Desplegado mediante Vercel CLI con el equipo dariomartinez2014. Los siguientes despliegues se realizan con `vercel --prod`; no quedó conectada la integración automática de GitHub. Credenciales de demostración entregadas localmente, fuera del repositorio.

Incluye la base del MP3 del PR #13, aún abierto. No se fusionó main automáticamente.
