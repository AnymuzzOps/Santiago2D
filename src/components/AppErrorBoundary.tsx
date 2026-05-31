import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Santiago2D render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-shell app-shell--fallback">
          <section className="hero-panel emergency-fallback" role="alert">
            <p className="eyebrow">Fallback de emergencia</p>
            <h1>Santiago2D</h1>
            <p>
              No pudimos cargar la interfaz completa, pero la app está activa.
              Recarga la página o revisa la consola del navegador para más detalles.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
