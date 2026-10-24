import assert from 'node:assert/strict';
import { createServer } from 'vite';
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { agruparCitasPorDia, normalizarEspecialidades } = await vite.ssrLoadModule('/src/lib/reportes.ts');
  const { extraerMensajeError } = await vite.ssrLoadModule('/src/lib/errorHandler.ts');
  const hoy = new Date(2026, 9, 23, 12);
  const resultado = agruparCitasPorDia([
    { fecha: new Date(2026,9,17,12).toISOString() },
    { fecha: new Date(2026,9,23,0,1).toISOString() },
    { fecha: new Date(2026,9,23,23,59).toISOString() },
    { fecha: new Date(2026,9,16,12).toISOString() },
    { fecha: new Date(2026,9,24,12).toISOString() },
    { fecha: 'inválida' },
  ], hoy);
  assert.equal(resultado.length, 7);
  assert.equal(resultado[0].fecha, '2026-10-17');
  assert.deepEqual(resultado.map(d => d.total), [1,0,0,0,0,0,2]);
  assert.deepEqual(normalizarEspecialidades([{ specialty:'Cardiología', total_appointments:'3' }]), [{ especialidad:'Cardiología',total:3 }]);
  assert.deepEqual(normalizarEspecialidades({ data:[{ especialidad:'Pediatría', total:2 }] }), [{ especialidad:'Pediatría', total:2 }]);
  assert.throws(() => normalizarEspecialidades([{ especialidad:'x', total:-1 }]));
  assert.throws(() => normalizarEspecialidades({ error:'fallo' }));
  assert.equal(extraerMensajeError({ isAxiosError:true, response:{ data:{ message:['Nombre requerido','Email inválido'] } } }), 'Nombre requerido. Email inválido');
  assert.equal(extraerMensajeError({ isAxiosError:true, response:{ data:null } }), 'Error del servidor');
  assert.equal(extraerMensajeError({ isAxiosError:true }), 'No se pudo conectar con el servidor');
  assert.equal(extraerMensajeError(new Error('fallo')), 'fallo');
  assert.equal(extraerMensajeError(null), 'Error inesperado');
  const { api } = await vite.ssrLoadModule('/src/lib/axios.ts');
  const { cargarReportes } = await vite.ssrLoadModule('/src/services/reportes.ts');
  const requests = [];
  api.get = async (url, config) => {
    requests.push([url, config?.params?.pagina]);
    if (url === '/reportes/especialidades') throw { isAxiosError:true, response:{ status:404 } };
    if (url === '/reports/appointments-by-specialty') return { data:[{ specialty:'Cardiología', total_appointments:3 }] };
    return { data:{ data:[{ fecha:new Date().toISOString() }], total:2, totalPaginas:2 } };
  };
  const reportes = await cargarReportes(new AbortController().signal);
  assert.equal(reportes.porEspecialidad[0].total, 3);
  assert.equal(reportes.porDia.reduce((sum,d) => sum+d.total, 0), 2);
  assert.equal(requests.filter(([url]) => url === '/citas').length, 2);
  api.get = async () => { throw { isAxiosError:true, response:{ status:403, data:{ mensaje:'Sin permiso' } } }; };
  await assert.rejects(() => cargarReportes(new AbortController().signal));
  console.log('16 verificaciones de reportes, paginación y errores completadas');
} finally { await vite.close(); }
