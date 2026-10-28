import type { Paciente } from '../types/paciente';

// Datos de ejemplo del MP1.
export const pacientesEjemplo: Paciente[] = [
    { id: 'PAC-001', nombre: 'Ana', apellido: 'López', email: 'ana.lopez@example.com', telefono: '0000-0001', especialidadAsignada: 'Medicina general', ultimaCita: '2026-10-10', estado: 'activo' },
    { id: 'PAC-002', nombre: 'Carlos', apellido: 'Pérez', email: 'carlos.perez@example.com', telefono: '0000-0002', especialidadAsignada: 'Cardiología', ultimaCita: '2026-10-09', estado: 'en_espera' },
    { id: 'PAC-003', nombre: 'María', apellido: 'García', email: 'maria.garcia@example.com', telefono: '0000-0003', especialidadAsignada: 'Dermatología', ultimaCita: '2026-09-25', estado: 'inactivo' },
    { id: 'PAC-004', nombre: 'José', apellido: 'Ramírez', email: 'jose.ramirez@example.com', telefono: '0000-0004', especialidadAsignada: 'Odontología', ultimaCita: '2026-10-12', estado: 'activo' },
    { id: 'PAC-005', nombre: 'Lucía', apellido: 'Morales', email: 'lucia.morales@example.com', telefono: '0000-0005', especialidadAsignada: 'Pediatría', ultimaCita: '2026-10-08', estado: 'en_espera' },
  ];

