# Día 2: Lazy loading y dashboard analítico

## Cambios

- Login y Dashboard se mantienen en la carga inicial.
- Las otras siete páginas usan `lazy(() => import(...))`.
- Un único `Suspense` envuelve las rutas con `Spinner fullscreen`.
- El mismo Spinner funciona dentro del Dashboard sin ocupar toda la pantalla.
- `useMemo` calcula las tarjetas, incluyendo total de pacientes y porcentaje de citas completadas. El porcentaje usa todas las citas como denominador y devuelve 0 si no hay citas.
- El botón **Actualizar datos**, con un callback memoizado, vuelve a llamar `cargar()` del store. Las nuevas respuestas actualizan las métricas.
- La tarjeta de citas completadas representa el total; no se etiqueta como “hoy” porque la consulta no filtra por fecha.

## Verificación

```sh
npm ci
npm run build -- --manifest
node scripts/test-lazy-dashboard.mjs
npm run lint
npm run test:stores
npm run test:auth
npm run test:reportes
```

El test valida actualizaciones del store, cero citas, error de API, las dos variantes de Spinner y el grafo de chunks de producción. Requiere ejecutar primero el build con `--manifest`.

Build, lint y las pruebas existentes de stores (29 comprobaciones), autenticación (18) y reportes (16) pasaron.

En una prueba del build de producción con una API local de datos ficticios, el Dashboard mostró 25 pacientes, 6 de 10 citas completadas (60%) y, al pulsar **Actualizar datos**, 7 de 10 (70%). No se modificaron pacientes ni citas reales.

## Comprobar Network

1. Configurar `VITE_API_URL` para el backend disponible y ejecutar `npm run build`.
2. Ejecutar `npm run preview` y abrir la app en Chrome.
3. Abrir DevTools → Network, activar Preserve log y filtrar JS.
4. Recargar el Dashboard: se carga el JS principal sin `PaginaPacientes` ni `PaginaReportes`.
5. Navegar a Pacientes y Reportes: cada visita descarga su chunk y las dependencias compartidas necesarias.

No se incluyeron credenciales, `.env`, dependencias ni el servidor temporal de datos ficticios en el commit.
