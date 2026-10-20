import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';

export default function PaginaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCargando(true);
    setError(false);
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <p className="my-4 text-slate-600">Usa tu cuenta de recepción de Clínica Salud Integral.</p>
      <form onSubmit={iniciarSesion} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block">Correo electrónico
          <input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-2" />
        </label>
        <label className="block">Contraseña
          <input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-2" />
        </label>
        {error && <p role="alert" className="text-red-700">No se pudo iniciar sesión. Revisa tus credenciales y la conexión.</p>}
        <button disabled={cargando} className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">{cargando ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </main>
  );
}
