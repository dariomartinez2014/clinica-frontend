import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { loadConfigFromFile } from 'vite';
const vercel = JSON.parse(await readFile('vercel.json','utf8'));
assert.deepEqual(vercel.rewrites,[{source:'/(.*)',destination:'/index.html'}]);
assert.equal(vercel.outputDirectory,'dist');
const parsed = ts.getParsedCommandLineOfConfigFile('tsconfig.app.json',{},ts.sys);
const virtual = path.resolve('src/__env_types_test.ts');
const contenido = 'export {}; const correcta: string = import.meta.env.VITE_API_URL; void correcta; const typo = import.meta.env.VITE_API_UR; void typo;';
const host = ts.createCompilerHost(parsed.options);
const leer = host.readFile.bind(host); const existe = host.fileExists.bind(host); const fuente = host.getSourceFile.bind(host);
host.fileExists = nombre => path.resolve(nombre) === virtual || existe(nombre);
host.readFile = nombre => path.resolve(nombre) === virtual ? contenido : leer(nombre);
host.getSourceFile = (nombre, version, onError, nuevo) => path.resolve(nombre) === virtual ? ts.createSourceFile(nombre,contenido,version,true) : fuente(nombre,version,onError,nuevo);
const programa = ts.createProgram([...parsed.fileNames,virtual],parsed.options,host);
const errores = ts.getPreEmitDiagnostics(programa);
assert.equal(errores.length,1,ts.formatDiagnosticsWithColorAndContext(errores,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));
assert.ok(ts.flattenDiagnosticMessageText(errores[0].messageText,' ').includes('VITE_API_UR'));
const previo = { vercel:process.env.VERCEL, api:process.env.VITE_API_URL };
try {
 process.env.VERCEL='1';
 for(const valor of ['', 'http://localhost:5195/api','http://backend.example.test/api','https://127.0.0.1/api']) {
  process.env.VITE_API_URL=valor;
  await assert.rejects(loadConfigFromFile({command:'build',mode:'production'},'vite.config.ts'),/VITE_API_URL/);
 }
 process.env.VITE_API_URL='https://backend.example.test/api';
 const config=await loadConfigFromFile({command:'build',mode:'production'},'vite.config.ts');
 assert.ok(config.config.plugins.length);
} finally {
 if(previo.vercel === undefined) delete process.env.VERCEL; else process.env.VERCEL=previo.vercel;
 if(previo.api === undefined) delete process.env.VITE_API_URL; else process.env.VITE_API_URL=previo.api;
}
console.log('OK: rewrite SPA, typo rechazado por TypeScript y validación HTTPS del backend en Vercel.');
