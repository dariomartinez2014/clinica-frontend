// Inspector HTTP local de QA. No se importa ni se incluye en el build de producción.
import { createServer } from 'vite';
import http from 'node:http';
import { writeFile } from 'node:fs/promises';
let captura=null;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
process.env.VITE_API_URL='/api';
const vite=await createServer({server:{host:'0.0.0.0',port:5197,strictPort:true},plugins:[{name:'evidencia-http-perfil',configureServer(server){server.middlewares.use((req,res,next)=>{
 if(req.url==='/__qa/network'){
 res.setHeader('Content-Type','text/html; charset=utf-8');
 const c=captura;
 res.end(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Network · Evidencia HTTP local</title><style>body{font:16px system-ui;background:#f1f5f9;color:#0f172a;padding:35px}main{max-width:1100px;margin:auto;background:white;border:1px solid #cbd5e1;border-radius:12px;padding:30px}h1{font-size:26px}nav{border-bottom:2px solid #059669;padding:14px 0;color:#047857;font-weight:bold}pre{background:#f8fafc;padding:18px;white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #e2e8f0;line-height:1.8}small{color:#64748b}.ok{color:#047857}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:14px;border-bottom:1px solid #e2e8f0}</style><main><small>Clínica Salud Integral · Día 3 · Registro real del proxy local de pruebas</small><nav>Network / PUT /auth/perfil</nav><h1>Petición de actualización del perfil</h1><p>Inspector HTTP de QA; esta pantalla no es Chrome DevTools.</p>${c?`<table><tr><th>Método</th><th>Ruta</th><th>Estado</th></tr><tr><td>${escape(c.method)}</td><td>${escape(c.url)}</td><td class="ok">${escape(c.status)}</td></tr></table><h2>Request Headers</h2><pre>Content-Type: ${escape(c.contentType)}</pre><h2>Form Data recibido</h2><pre>${escape(c.campos.join('\n'))}</pre><p>Archivo adjunto: ${escape(c.archivo??'Ninguno')}</p><small>Token y datos personales excluidos del registro. ${escape(c.fecha)}</small>`:'<p>Aún no se ha enviado el formulario.</p>'}</main></html>`);return;
 }
 if(!req.url?.startsWith('/api/'))return next();
 const partes=[];
 const upstream=http.request({hostname:'localhost',port:5195,path:req.url,method:req.method,headers:{...req.headers,host:'localhost:5195'}},r=>{
 res.writeHead(r.statusCode??502,r.headers);r.pipe(res);
 if(req.method==='PUT'&&req.url==='/api/auth/perfil'){
 const body=Buffer.concat(partes).toString('latin1');
 const campos=[...body.matchAll(/; name="([^"\r\n]+)"/g)].map(m=>m[1]);
 captura={method:req.method,url:req.url,status:r.statusCode,contentType:req.headers['content-type'],campos:[...new Set(campos)],archivo:body.match(/filename="([^"\r\n]+)"/)?.[1],fecha:new Date().toISOString()};
 void writeFile('docs/mp3-dia3/peticion-multipart.json',JSON.stringify(captura,null,2)+'\n');
 }
 });
 upstream.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end('Backend no disponible');});
 req.on('data',c=>{if(req.url==='/api/auth/perfil')partes.push(c);});req.pipe(upstream);
 });}}]});await vite.listen();console.log('QA real: http://localhost:5197/perfil · Inspector: /__qa/network');
