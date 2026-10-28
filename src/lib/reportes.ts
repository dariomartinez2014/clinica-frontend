import type { Cita } from '../types/cita';
import type { CitasPorDia, ReporteEspecialidad } from '../types/reporte';

export function normalizarEspecialidades(respuesta: unknown): ReporteEspecialidad[] {
  const filas: unknown = Array.isArray(respuesta) ? respuesta
    : typeof respuesta === 'object' && respuesta !== null && 'data' in respuesta ? respuesta.data : null;
  if (!Array.isArray(filas)) throw new Error('Formato de reportes no reconocido');
  return filas.map((fila: unknown) => {
    if (typeof fila !== 'object' || fila === null) throw new Error('Especialidad inválida');
    const nombre: unknown = 'especialidad' in fila ? fila.especialidad : 'specialty' in fila ? fila.specialty : null;
    const valor: unknown = 'total' in fila ? fila.total : 'total_appointments' in fila ? fila.total_appointments : null;
    const total = typeof valor === 'string' && valor.trim() ? Number(valor) : valor;
    if (typeof nombre !== 'string' || typeof total !== 'number' || !Number.isFinite(total) || total < 0) throw new Error('Datos de especialidad inválidos');
    return { especialidad: nombre, total };
  });
}

// Siete días de calendario local, incluidos hoy y los días sin citas.
export function agruparCitasPorDia(citas: Pick<Cita, 'fecha'>[], hoy = new Date()): CitasPorDia[] {
  const clave = (fecha: Date) => [fecha.getFullYear(), String(fecha.getMonth()+1).padStart(2,'0'), String(fecha.getDate()).padStart(2,'0')].join('-');
  const dias = Array.from({ length: 7 }, (_, indice) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 6 + indice);
    return { fecha: clave(fecha), dia: fecha.toLocaleDateString('es-GT', { day: '2-digit', month: 'short' }), total: 0 };
  });
  for (const cita of citas) {
    const fecha = new Date(cita.fecha);
    if (Number.isNaN(fecha.getTime())) continue;
    const dia = dias.find(d => d.fecha === clave(fecha));
    if (dia) dia.total++;
  }
  return dias;
}
