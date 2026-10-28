import axios from 'axios';
export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError<unknown>(err)) {
    const data: unknown = err.response?.data;
    if (typeof data === 'object' && data !== null) {
      for (const key of ['message', 'mensaje', 'error']) {
        if (key in data) {
          const value: unknown = Reflect.get(data, key);
          if (typeof value === 'string' && value.trim()) return value;
          if (Array.isArray(value) && value.length > 0 && value.every((item: unknown) => typeof item === 'string')) return value.join('. ');
        }
      }
    }
    return err.response ? 'Error del servidor' : 'No se pudo conectar con el servidor';
  }
  if (err instanceof Error) return err.message;
  return 'Error inesperado';
}
