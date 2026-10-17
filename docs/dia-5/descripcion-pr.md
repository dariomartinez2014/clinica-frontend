## MP1 — SPA navegable de la clínica

Integra los días 1 a 4 con React Router DOM. Las cinco rutas comparten Layout con sidebar, NavLink activo y Outlet. Agrega detalle por useParams, retorno y cancelación con useNavigate(-1), enlaces de pacientes y página 404 reutilizable.

La lista de pacientes vive en App y se pasa por props para conservar altas, cambios y bajas al navegar al detalle. Los datos siguen siendo ficticios y en memoria; no hay backend.

## Verificación

- npm run build y npm run lint sin errores ni advertencias; sin any en src.
- Navegación entre Dashboard, pacientes, detalle y nueva cita; Volver y Cancelar.
- Paciente agregado y actualizado conservado al visitar las demás páginas.
- Filtros, eliminación, contador y mantenimiento conservados.
- Errores y confirmación de citas; ambos casos 404 y retorno al inicio.
- Revisión en laptop y móvil.

El GIF de docs/dia-5 reúne 13 capturas reales de las cinco rutas. También incluye capturas del sidebar activo, detalle y formulario con errores.

main todavía contiene el día 2: este PR final incorpora también el trabajo anterior de los días 3 y 4. Esperar revisión antes de hacer merge.
