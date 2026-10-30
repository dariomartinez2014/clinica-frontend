import assert from 'node:assert/strict';
import { createServer } from 'vite';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};globalThis.window={localStorage};
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
try{
const {perfilSchema}=await vite.ssrLoadModule('/src/schemas/perfilSchema.ts');
const valido={nombre:'Ana Prueba',email:'ana@example.com',telefono:'12345678'};
eq(perfilSchema.safeParse(valido).success,true);
for(const cambio of [{nombre:'AB'},{nombre:'  A  '},{email:'incorrecto'},{telefono:'1234567'},{telefono:'1234567890123456'},{telefono:'+50212345678'}])eq(perfilSchema.safeParse({...valido,...cambio}).success,false);
eq(perfilSchema.safeParse({...valido,telefono:''}).success,true);eq(perfilSchema.safeParse({...valido,telefono:undefined}).success,true);
const {useAuthStore:auth}=await vite.ssrLoadModule('/src/stores/authStore.ts');const {api}=await vite.ssrLoadModule('/src/lib/axios.ts');const {actualizarPerfil}=await vite.ssrLoadModule('/src/services/perfil.ts');
const usuario={id:1,nombre:'Ana Prueba',email:valido.email,rol:'RECEPCIONISTA',telefono:valido.telefono,foto:null};auth.getState().login('token-local',usuario);
let enviada;api.defaults.adapter=async(config)=>{enviada=config;return {data:{...usuario,nombre:'Ana Nueva',foto:'http://localhost:3000/api/fotos/prueba.png'},status:200,statusText:'OK',headers:{},config};};
const form=new FormData();form.append('nombre','Ana Nueva');form.append('email',valido.email);form.append('telefono',valido.telefono);form.append('foto',new Blob(['imagen'],{type:'image/png'}),'prueba.png');
const u=await actualizarPerfil(form);eq(enviada.method,'put');eq(enviada.url,'/auth/perfil');eq(enviada.headers.Authorization,'Bearer token-local');eq(enviada.data,form);eq(form.get('nombre'),'Ana Nueva');eq(form.get('email'),valido.email);eq(form.get('telefono'),valido.telefono);eq(form.get('foto').name,'prueba.png');
auth.getState().actualizarUsuario(u);eq(auth.getState().usuario.nombre,'Ana Nueva');eq(auth.getState().token,'token-local');eq(auth.getState().usuario.foto,u.foto);const guardado=storage.get('auth-storage');auth.setState({usuario:null});storage.set('auth-storage',guardado);await auth.persist.rehydrate();eq(auth.getState().usuario.foto,u.foto);
auth.getState().logout();auth.getState().actualizarUsuario(u);eq(auth.getState().usuario,null);console.log(`OK: ${checks} comprobaciones de Zod, FormData, servicio, store y persistencia.`);
}finally{await vite.close();delete globalThis.window;delete globalThis.localStorage;}
