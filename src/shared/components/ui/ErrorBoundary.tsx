import { Component, type ReactNode } from "react";
import AlertaBanner from "./AlertaBanner";
interface Props { children: ReactNode; fallback?: ReactNode; nombre?: string }
export default class ErrorBoundary extends Component<Props, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() { return { fallo: true }; }
  render() {
    if (this.state.fallo) return <section className="mx-auto max-w-6xl p-6">
      {this.props.fallback ?? <AlertaBanner tipo="error" mensaje={`No se pudo mostrar esta sección: ${this.props.nombre ?? "contenido"}. Las demás secciones siguen disponibles.`} />}
      <button type="button" onClick={() => this.setState({ fallo: false })} className="rounded-lg border border-slate-300 bg-white px-4 py-2">Reintentar sección</button>
    </section>;
    return this.props.children;
  }
}
