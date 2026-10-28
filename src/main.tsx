import { Toaster } from "react-hot-toast";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Navegación de la app sin recargar la página. */}
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 4500 }} />
    </BrowserRouter>
  </StrictMode>,
);
