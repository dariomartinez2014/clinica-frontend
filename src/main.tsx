import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ROUTER: permite usar enlaces y hooks de navegación en toda la app. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
