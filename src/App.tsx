import { GameMap } from './components/GameMap';
import { RenderedTileViewer } from './components/RenderedTileViewer';

const isRenderedTilePrototypeEnabled = import.meta.env.VITE_ENABLE_RENDERED_TILE_VIEWER === 'true';

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="app-title">
        <p className="eyebrow">MVP navegable</p>
        <h1 id="app-title">Santiago2D</h1>
        <p>
          Un mapa 2D estilo videojuego/pixel art de Santiago de Chile, centrado
          en Providencia y listo para conectar una fuente legal de vector tiles.
        </p>
      </section>

      <GameMap />
      {isRenderedTilePrototypeEnabled && <RenderedTileViewer />}
    </main>
  );
}
