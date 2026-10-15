## Formulario de nueva cita

Agrega `/citas/nueva` con los seis campos validados por Zod y el tipo derivado con `z.infer`. React Hook Form muestra errores por campo, espera 1.5 segundos al enviar y presenta una confirmación con opción de limpiar el formulario.

`useMedicos` simula una carga de 800 ms y cancela el timer en su cleanup. Se conserva el acceso actual por pathname; React Router queda para el día 5. Son datos ficticios en memoria.

## Validación

- `npm run build` y `npm run lint` correctos; sin `any` en `src`.
- 22 comprobaciones del esquema, incluidos fechas inexistentes/pasadas y límites de hora y motivo.
- Navegador: errores, fecha pasada, médicos, submit deshabilitado, confirmación y reset.
- Capturas en `docs/dia-4/README.md`: carga, errores, envío y éxito.

Basado en `main`; el día 3 permanece en su rama independiente. Esperar revisión antes del merge.
