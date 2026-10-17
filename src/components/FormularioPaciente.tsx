import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { EstadoPaciente, Paciente } from '../types/paciente';

interface Props { onAgregar: (paciente: Paciente) => void }

export default function FormularioPaciente({ onAgregar }: Props) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<EstadoPaciente>('activo');
  const [error, setError] = useState('');

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }
    onAgregar({ id: crypto.randomUUID(), nombre: nombre.trim(), apellido: apellido.trim(),
      email: email.trim(), estado, telefono: 'No registrado', especialidadAsignada: 'Sin asignar', ultimaCita: '' });
    setNombre(''); setApellido(''); setEmail(''); setEstado('activo'); setError('');
  }

  const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2';
  return (
    <form onSubmit={enviar} noValidate className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold">Agregar paciente</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label htmlFor="nuevo-nombre">Nombre *<input id="nuevo-nombre" value={nombre} required
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} className={inputClass} /></label>
        <label htmlFor="nuevo-apellido">Apellido<input id="nuevo-apellido" value={apellido}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)} className={inputClass} /></label>
        <label htmlFor="nuevo-email">Email *<input id="nuevo-email" type="email" value={email} required
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className={inputClass} /></label>
        <label htmlFor="nuevo-estado">Estado<select id="nuevo-estado" value={estado}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setEstado(e.target.value as EstadoPaciente)} className={inputClass}>
          <option value="activo">Activo</option><option value="inactivo">Inactivo</option><option value="en_espera">En espera</option>
        </select></label>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      <button type="submit" className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800">Agregar paciente</button>
    </form>
  );
}
