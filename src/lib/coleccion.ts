// El backend puede devolver una colección paginada o un array plano.
export type Coleccion<T> = { data: T[]; total: number } | T[];

export function obtenerTotal<T>(respuesta: Coleccion<T>): number {
  return Array.isArray(respuesta) ? respuesta.length : respuesta.total;
}

export function obtenerDatos<T>(respuesta: Coleccion<T>): T[] {
  return Array.isArray(respuesta) ? respuesta : respuesta.data;
}
