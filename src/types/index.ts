// Apunte de estudio: Aquí describo la forma de los datos con TypeScript. Estos tipos no ejecutan validaciones en el servidor.
// Datos de las métricas del dashboard.
export type Tendencia = 'positiva' | 'negativa' | 'neutra';

export interface Metrica {
  id: string;
  titulo: string;
  valor: number | string;
  descripcion: string;
  tendencia: Tendencia;
  icono: string;
}
