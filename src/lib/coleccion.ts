// La API puede devolver un objeto con total o solo un array.
export type Coleccion<T> = { data: T[]; total: number } | T[];

export function obtenerTotal<T>(respuesta: Coleccion<T>): number {
  return Array.isArray(respuesta) ? respuesta.length : respuesta.total;
}

export function obtenerDatos<T>(respuesta: Coleccion<T>): T[] {
  return Array.isArray(respuesta) ? respuesta : respuesta.data;
}
