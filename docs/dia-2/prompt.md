# Prompt estructurado — Día 2

Herramienta: Codex, como herramienta de generación de UI con IA equivalente. No se usó Stitch.

## Contexto

Estoy practicando React, TypeScript y Tailwind en Clínica Salud Integral. Necesito una primera versión visual de una página de pacientes. Después analizaré esta primera versión y la separaré en componentes.

## Contrato

Usar exactamente `Paciente` y `EstadoPaciente` definidos en src/types/paciente.ts: id, nombre, apellido, email, telefono, especialidadAsignada, ultimaCita y estado (activo, inactivo o en_espera). No usar any ni añadir datos clínicos.

## Primera generación

Generar una página autocontenida con cinco pacientes ficticios y las tarjetas recorriendo sus datos con map. Incluir un input controlado de búsqueda con estado local. El filtrado, creación, edición y eliminación quedan para el día 3. Usar correos example.com y teléfonos ficticios, visibles como datos de demostración.

## Diseño

Mantener la paleta del dashboard. En móvil, tarjetas verticales con flex flex-col; en escritorio, grid de tarjetas. Mostrar todos los campos del paciente y una etiqueta con texto y color diferente para cada estado. Evitar desbordamiento de correos largos. Sin imágenes ni dependencias nuevas.

## Revisión posterior

Conservar la primera salida, identificar al menos tres aspectos que mejorar y refactorizar a BadgeEstado, PacienteCard, BuscadorPacientes y PaginaPacientes con props tipadas. Conservar una captura antes y otra después.
