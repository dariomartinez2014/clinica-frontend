# MP2 — Día 1: datos reales

En esta tarea el dashboard y los pacientes usan el backend Express de Clínica Salud Integral. `catalogo` es otro proyecto de práctica.

## Cómo probarlo

1. Iniciar el backend con su `.env` de PostgreSQL y JWT: `npm install`, `npm run build` y `npm start`.
2. En el frontend, ejecutar `npm install`, copiar `.env.example` a `.env.local` y ejecutar `npm run dev`.
3. Abrir `http://localhost:5173/login` y entrar con una cuenta de recepción.

Las contraseñas y los tokens no se suben al repositorio.

## Qué hace cada parte

- `src/lib/axios.ts`: tiene la URL del backend, un límite de espera de 8 segundos y los interceptores. Agrega el token si existe y lleva al login si una petición responde 401. Si falla el propio login, muestra el error sin recargar el formulario.
- `src/lib/coleccion.ts`: lee el total de `{ data, total }` o cuenta los elementos si la respuesta es un array.
- `PaginaDashboard`: pide los totales de pacientes, médicos y citas. Las cuatro consultas salen en paralelo.
- `usePacientes`: carga los pacientes y maneja el spinner, el error y el reintento. La lista también se usa en el detalle.
- `src/lib/pacientes.ts`: pasa los IDs numéricos a texto para usarlos en las rutas. Si el servidor no trae un dato, se muestra “Sin información”.

Las peticiones se cancelan al salir de la página. Los botones para agregar, cambiar estado y eliminar pacientes todavía hacen cambios locales, como en el MP1. La conexión de esas acciones queda para el día 2. El total de registrados viene del servidor.

## Cambios en el backend

Se agregó CORS para permitir las peticiones desde `http://localhost:5173`.

También se agregó `GET /api/citas`, que pide token y rol de recepción. Acepta `estado=Programada` o `estado=Completada` y devuelve `{ data, total }`. Los pacientes y médicos siguen devolviendo arrays.

Para “Completadas Hoy” se filtran las citas completadas cuya fecha corresponde al día actual de Guatemala. La base no guarda una fecha aparte para saber cuándo se completó la cita.

## Pruebas realizadas

- Build y lint del frontend correctos, sin `any`. Build del backend correcto.
- Login con cuenta local de prueba y consultas al backend con PostgreSQL: 3 pacientes, 7 médicos, 1 cita programada y 0 completadas hoy. Las cuatro consultas respondieron 200.
- La lista muestra “3 paciente(s) registrado(s)” y el detalle abre con el ID real.
- CORS acepta el token en el header Authorization. Sin token, el servidor responde 401; con un estado de cita inválido, responde 400.
- Para ver el spinner se usó un proxy local que demoró la respuesta 4 segundos. También se simuló un error 503: apareció el mensaje y, al recuperar la conexión, “Reintentar” cargó los pacientes.
- Una respuesta 401 llevó al login.

El proxy ya está detenido. La app quedó conectada directamente a `http://localhost:3000/api`.

[Resultados de las consultas HTTP](validacion-http.json).

![Dashboard con datos reales](dashboard-api.png)

![Spinner de pacientes](pacientes-cargando.png)

![Error y botón Reintentar](pacientes-error.png)

## Lo que falta para entregar

Falta la captura de Network. El control del navegador se detuvo porque no pudo verificar la URL, así que esa captura no se pudo guardar. Las imágenes anteriores muestran la app, pero no reemplazan la captura que pide la tarea.

Para hacerla: abrir la app en Chrome, iniciar sesión, pulsar F12 y entrar a Network → Fetch/XHR. Recargar el dashboard y capturar las cuatro consultas con estado 200: `pacientes`, `medicos`, `citas?estado=Programada` y `citas?estado=Completada`. Dejar fuera los tokens y los headers de autorización.

La rama parte del MP1 día 5. Los PR de días 3, 4 y 5 siguen abiertos; el PR de esta tarea va hacia `main`.
