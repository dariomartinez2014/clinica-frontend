# Clínica Salud Integral — Día 1

Dashboard de práctica con Vite, React, TypeScript y Tailwind CSS.

## Ejecutar

```bash
npm install
npm run dev
```

Abre la dirección indicada en la terminal. El dashboard es la pantalla inicial `/`.

## Archivos para estudiar

- `src/types/index.ts`: contrato `Metrica` y unión `Tendencia`.
- `src/components/MetricCard.tsx`: recibe una métrica por props y usa `Record<Tendencia, string>` para elegir el color de su descripción.
- `src/components/StatusBadge.tsx`: recibe `activo` y muestra el estado del sistema.
- `src/pages/PaginaDashboard.tsx`: cuatro métricas, estados, botones de pacientes y mantenimiento.
- `vite.config.ts` e `src/index.css`: integración de Tailwind.

Los comentarios del código señalan qué hace cada parte. Las métricas son datos de ejemplo; no se guardan al recargar y no hay backend.

## Validación del día 1

- `npm run build`: ejecuta TypeScript (`tsc -b`) y la compilación de Vite. Correcto.
- `npm run lint`: correcto.
- TypeScript estricto y sin `any` en el código de la aplicación.
- En el navegador: pacientes 128 → 129 al pulsar + y 129 → 128 al pulsar −.
- Mantenimiento: banner rojo y etiqueta “Modo Mantenimiento”; al desactivarlo desaparece el banner y vuelve “Sistema Operativo”.
- El contador impide valores negativos.

## Capturas

![Dashboard](docs/dashboard.png)

![Mantenimiento](docs/dashboard-mantenimiento.png)

## Entrega

Rama: `feat/dia-1-dashboard`. Pull Request hacia `main`; esperar revisión antes del merge.

## Referencias

- https://vite.dev/guide/
- https://tailwindcss.com/docs/installation/using-vite
