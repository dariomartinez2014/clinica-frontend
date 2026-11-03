# Clínica Salud Integral

Proyecto de práctica con React, TypeScript y Vite.

## MP2 — Día 1

El dashboard y la lista de pacientes ahora cargan los datos del backend con Axios. Hay un spinner mientras carga, un mensaje si falla y un botón para reintentar.

Axios agrega el token de sesión a las peticiones. Si el servidor responde 401, la app lleva al login.

## MP2 — Día 2

Ya se pueden registrar, editar y eliminar pacientes. Los formularios usan React Hook Form y Zod. Los avisos de éxito y error aparecen con react-hot-toast.

La agenda médica cambia el estado de las citas con `useOptimistic`: el cambio se ve al instante y se revierte si falla la petición. También se pueden crear citas desde el formulario.

[Pruebas y capturas del día 2](docs/mp2-dia2/README.md).

## MP2 — Día 3

Pacientes, citas y filtros ahora se comparten con Zustand. Los componentes usan selectores y las acciones tienen nombre para Redux DevTools. Las métricas y los médicos también tienen stores para evitar copias locales de datos de la API.

[Cambios, pruebas y pasos para DevTools](docs/mp2-dia3/README.md).

## MP2 — Día 4

El buscador espera 350 ms después de dejar de escribir antes de consultar pacientes. Tiene un spinner dentro del input y conserva la búsqueda al ir al detalle y volver. El backend permite buscar por nombre, apellido y correo, con resultados paginados.

[Pruebas y GIF del buscador](docs/mp2-dia4/README.md).

## Cómo ejecutarlo

Primero iniciar el backend de `clinica-salud-integral` en el puerto 3000. Después, en este proyecto:

```bash
npm install
```

Copiar `.env.example` a `.env.local` y ejecutar:

```bash
npm run dev
```

Abrir `http://localhost:5173/login` y entrar con una cuenta de recepción para gestionar pacientes y crear citas. Para cambiar estados, usar una cuenta de médico y elegir “Agenda médica” al iniciar sesión.

[Explicación del día 1, pruebas y capturas](docs/mp2-dia-1/README.md).

## Comprobaciones

```bash
npm run build
npm run lint
npm run test:stores
```

Ambos comandos pasan.

## Trabajos anteriores del MP1

- [Día 2: lista de pacientes](docs/dia-2/README.md)
- [Día 3: filtros y acciones locales](docs/dia-3/README.md)
- [Día 4: formulario de citas](docs/dia-4/README.md)
- [Día 5: navegación y recorrido de la app](docs/dia-5/README.md)

Estas páginas corresponden a las prácticas anteriores, cuando se usaban datos de ejemplo.


## MP3 — Día 3

Perfil con Zod, foto con previsualización local y actualización del usuario persistido. [Pruebas y capturas](docs/mp3-dia3/README.md).
