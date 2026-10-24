# MP2 — Día 5

## Implementación

- DTOs centralizados en src/types/dtos.ts derivados con Omit, Partial y Pick. El modelo de registro conserva los tipos reales del backend; la vista Paciente tiene campos de presentación que no deben enviarse al crear.
- extraerMensajeError recibe unknown, usa axios.isAxiosError<unknown> y valida el contenido antes de leer message, mensaje o error. Acepta listas de mensajes de validación.
- /reportes carga especialidades y citas desde Axios. Intenta GET /reportes/especialidades; solo ante 404 usa el endpoint existente del MP1 GET /reports/appointments-by-specialty. No reemplaza errores de permiso con datos ficticios.
- La gráfica de barras normaliza la respuesta en inglés del MP1. La línea agrupa GET /citas por día local: hoy y los seis días previos, con cero donde no hay citas y descartando fechas fuera del intervalo. Recorre las páginas si la API devuelve paginación.
- NavLink en Layout y enlace desde Dashboard. Skeleton, error con reintento y estados vacíos. Las dos gráficas tienen contenedores adaptables de 300 px de alto.

## Verificación

- npm run build
- npm run lint
- npm run test:stores: 29 comprobaciones del CRUD, concurrencia, filtros y acciones DevTools.
- npm run test:reportes: 16 comprobaciones de fechas, normalización, errores, paginación y fallback de ruta. Las respuestas simuladas existen únicamente en las pruebas; la aplicación consulta la API real.
- Sin usos de any en src.

## Evidencia pendiente

La validación visual con datos reales, el video/GIF y la captura de Redux DevTools requieren una sesión del backend con permisos adecuados. El conflicto de permisos fue resuelto con autorización: GET /citas admite GERENCIA y RECEPCIONISTA. El backend pasó 16 comprobaciones reales de acceso y reportes, manteniendo prohibidas la creación y modificación para GERENCIA. Cambio del backend: rama feat/mp2-dia5-reportes-lectura, commit d9806bf. No se considera completada la evidencia mientras falten estas verificaciones.
