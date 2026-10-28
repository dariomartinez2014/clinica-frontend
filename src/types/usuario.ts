export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string | null;
  foto?: string | null;
}
