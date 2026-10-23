// Instrumentación temporal para el GIF: solo observa eventos y peticiones reales.
let ultimaTecla = 0;
let peticiones = 0;
const panel = document.createElement('aside');
panel.id='registro-debounce';
panel.style.cssText='position:fixed;right:18px;bottom:18px;z-index:1000;width:460px;background:#0f172a;color:#e2e8f0;padding:20px;border-radius:14px;box-shadow:0 8px 30px #0005;font:14px system-ui';
const titulo=document.createElement('strong');titulo.textContent='Peticiones reales · Performance API';panel.append(titulo);
const ayuda=document.createElement('p');ayuda.textContent='Escribe sin pausa. El registro observa GET /pacientes.';panel.append(ayuda);
const estado=document.createElement('p');estado.textContent='Esperando escritura…';panel.append(estado);
const lista=document.createElement('ol');lista.id='peticiones-observadas';panel.append(lista);document.body.append(panel);
document.addEventListener('input',event=>{if(event.target instanceof HTMLInputElement && event.target.id==='buscar-pacientes'){ultimaTecla=performance.now();estado.textContent='Escribiendo: '+event.target.value+' · '+peticiones+' petición(es) observadas';}});
new PerformanceObserver(list=>{for(const entry of list.getEntries()){
 const url=new URL(entry.name);if(!ultimaTecla || url.pathname!=='/api/pacientes')continue;
 const pausa=Math.round(entry.startTime-ultimaTecla);if(pausa<0)continue;
 peticiones++;const item=document.createElement('li');item.textContent='GET ?query='+url.searchParams.get('query')+' · '+pausa+' ms desde última tecla';lista.append(item);
 estado.textContent=peticiones+' petición(es) tras la pausa';
}}).observe({type:'resource',buffered:false});
