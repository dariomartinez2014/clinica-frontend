// Apunte de estudio: Aquí describo la forma de los datos con TypeScript. Estos tipos no ejecutan validaciones en el servidor.
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string | null;
  foto?: string | null;
}
