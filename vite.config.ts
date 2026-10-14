import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// PLUGINS: activo React y Tailwind en Vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
