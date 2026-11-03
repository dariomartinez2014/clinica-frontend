# MP4 — Día 3: Custom Hooks

La lógica de pacientes ahora está en src/features/pacientes/hooks/usePacientes.ts: datos, carga inicial, cancelación, búsqueda con debounce, filtros, paginación y acciones crear/actualizar/eliminar. Los formularios y tarjetas pueden consumir acciones sin iniciar otra carga; el formulario de citas conserva la carga de la lista completa.

src/features/citas/hooks/useCitas.ts encapsula datos, selección, filtros, creación y actualización de estado. Permite cargar por paciente o médico, o reutilizar las citas que ya llegaron con el expediente. La agenda mantiene su consulta explícita desde el formulario.

useDetallePaciente compone useApi y useCitas para evitar repetir peticiones. useHistorialCitas conserva la paginación y los filtros en la URL. Dashboard, Login y Perfil también consumen hooks para que ninguna página importe stores. Las páginas no contienen useEffect. Los comentarios en español explican las decisiones por bloque.

Validación: npm run build y npm run lint aprobados; test:stores (29), test:rutas (13), test:perfil (22) y test:mp3 aprobados. Revisión de src/pages sin imports de stores, useEffect ni any. No se verificó este cambio en navegador local porque el navegador no alcanzó el servidor local; no se cambió el despliegue público en este ejercicio.

La captura del diff adjunta al PR compara PaginaPacientes antes/después de extraer la lógica. Este PR parte del trabajo de MP4 Día 1 y contiene cambios anteriores todavía pendientes de integrar en main. No se fusiona main automáticamente.
