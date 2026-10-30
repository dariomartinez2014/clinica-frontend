## Cambios

Completa la capa de robustez de la Clínica: skeletons según contenido, ErrorBoundary por sección que conserva la navegación y biblioteca compartida de alertas, estados vacíos, modales y spinner inline/fullscreen. Agrega historial de citas con paciente, estado y página en URL; conserva autenticación persistente, protección por rol y perfil con foto de los días anteriores.

## Validación

- Build y lint sin errores; sin `any` en `src/`.
- Pasan las suites auth, rutas, perfil, stores, reportes y mp3.
- Recorrido manual con HTTP/datos ficticios: login → dashboard → pacientes → perfil → historial → logout; F5, redirección sin sesión, rol y aislamiento del fallo de Reportes.
- El historial pagina localmente las citas entregadas por el expediente de la API existente.

## Evidencias y límites

Ver [recorrido y capturas](docs/mp3-completo/README.md). El GIF se compone de capturas reales de QA; todos los datos son ficticios. La evidencia de Authorization es un registro de peticiones HTTP reales de QA, **no una captura de Chrome DevTools Network**. Falta complementar esa evidencia si el docente exige ese panel, y repetir con la cuenta/API de evaluación antes de entregar. El build conserva una advertencia de bundle grande por Recharts.
