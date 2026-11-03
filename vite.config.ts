import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  if (command === "build" && process.env.VERCEL) {
    const entorno = loadEnv(mode, process.cwd(), "VITE_");
    const apiUrl = process.env.VITE_API_URL ?? entorno.VITE_API_URL;
    let url: URL;
    try { url = new URL(apiUrl); }
    catch { throw new Error("Configura VITE_API_URL en Vercel con la URL HTTPS del backend de producción."); }
    if (url.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(url.hostname)) {
      throw new Error("VITE_API_URL en Vercel debe apuntar a un backend público mediante HTTPS, no a localhost.");
    }
  }
  return { plugins: [react(), tailwindcss()] };
});
