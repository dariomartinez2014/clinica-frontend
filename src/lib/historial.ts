// Apunte de estudio: Aquí filtro las citas antes de paginarlas para que el contador y las páginas correspondan al filtro.
import type { Cita } from "../types/cita";
// Aquí aplico el filtro y calculo los registros y límites de la página solicitada.
export function paginarCitas(datos: Cita[], estado: string, numero: number, limite = 6) {
  const filtradas = datos.filter(cita => estado === "Todos" || cita.estado === estado).toSorted((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha) || b.id - a.id);
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / limite));
  const pagina = Math.min(totalPaginas, Number.isSafeInteger(numero) && numero > 0 ? numero : 1);
  return { citas: filtradas.slice((pagina - 1) * limite, pagina * limite), pagina, totalPaginas, total: filtradas.length };
}
