// Apunte de estudio: Aquí describo la forma de los datos con TypeScript. Estos tipos no ejecutan validaciones en el servidor.
export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
