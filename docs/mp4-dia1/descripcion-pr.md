Prepara la Clínica para desplegar en Vercel: rewrite SPA, tipado estricto de VITE_API_URL, exclusión de archivos de entorno y credenciales, y validación de una API HTTPS pública durante el build de Vercel. Divide Perfil y Reportes en cargas diferidas y conserva boundaries por sección, incluido login.

Build y lint pasan sin errores ni advertencias de tamaño. Pasan auth, rutas, perfil, mp3 y la prueba nueva `node scripts/test-deploy.mjs` (rewrites, typo de entorno y rechazo de localhost en producción).

**Borrador: el despliegue no está completado.** Faltan sesión de Vercel con la cuenta autorizada, URL real del backend, CORS del origen de producción, verificación de login/F5 en la URL real y captura de producción. No hay una URL de Vercel que se pueda entregar todavía.

Detalles y pasos pendientes en [la guía](https://github.com/dariomartinez2014/clinica-frontend/blob/feat/mp4-dia1-deploy/docs/mp4-dia1/README.md). Incluye los cambios del MP3 del PR #13, aún abierto; este PR se dirige a main como pide la tarea y no fusiona nada automáticamente.
