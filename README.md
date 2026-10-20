# Clínica Salud Integral

Proyecto de práctica con React, TypeScript y Vite.

## MP2 — Día 1

El dashboard y la lista de pacientes ahora cargan los datos del backend con Axios. Hay un spinner mientras carga, un mensaje si falla y un botón para reintentar.

Axios agrega el token de sesión a las peticiones. Si el servidor responde 401, la app lleva al login.

## Cómo ejecutarlo

Primero iniciar el backend de `clinica-salud-integral` en el puerto 3000. Después, en este proyecto:

```bash
npm install
```

Copiar `.env.example` a `.env.local` y ejecutar:

```bash
npm run dev
```

Abrir `http://localhost:5173/login` y entrar con una cuenta de recepción.

[Explicación del día 1, pruebas y capturas](docs/mp2-dia-1/README.md).

## Comprobaciones

```bash
npm run build
npm run lint
```

Ambos comandos pasan. Todavía falta adjuntar la captura del panel Network que pide la tarea.

## Trabajos anteriores del MP1

- [Día 2: lista de pacientes](docs/dia-2/README.md)
- [Día 3: filtros y acciones locales](docs/dia-3/README.md)
- [Día 4: formulario de citas](docs/dia-4/README.md)
- [Día 5: navegación y recorrido de la app](docs/dia-5/README.md)

Estas páginas corresponden a las prácticas anteriores, cuando se usaban datos de ejemplo.
