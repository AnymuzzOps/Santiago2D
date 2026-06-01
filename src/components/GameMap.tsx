import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { mapConfig } from '../config/mapConfig';
import { DemoPixelMap } from './DemoPixelMap';
import { createSantiagoGameStyle } from '../map/style';

const tileUrl = import.meta.env.VITE_TILE_URL?.trim();

export function GameMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [hasTileError, setHasTileError] = useState(false);

  const shouldRenderMapLibre = Boolean(tileUrl);
  const shouldRenderDemoPixelMap = !shouldRenderMapLibre;

  useEffect(() => {
    if (!shouldRenderMapLibre || !tileUrl || !mapContainerRef.current || mapRef.current) {
      return;
    }

    let isMounted = true;

    Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')])
      .then(([maplibreModule]) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) {
          return;
        }

        const maplibregl = maplibreModule.default;
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: createSantiagoGameStyle(tileUrl),
          center: mapConfig.initialCenter,
          zoom: mapConfig.initialZoom,
          minZoom: mapConfig.minZoom,
          maxZoom: mapConfig.maxZoom,
          maxBounds: mapConfig.navigationBounds,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        });

        map.on('error', (event: unknown) => {
          const mapError = event as { sourceId?: string; tile?: { source?: string } };
          const sourceId = mapError.sourceId ?? mapError.tile?.source;
          if (sourceId === 'santiago') {
            setHasTileError(true);
          }
        });

        map.addControl(
          new maplibregl.NavigationControl({
            visualizePitch: false,
            showCompass: true,
          }),
          'top-right',
        );

        map.addControl(
          new maplibregl.AttributionControl({
            customAttribution:
              '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
            compact: false,
          }),
          'bottom-right',
        );

        mapRef.current = map;
      })
      .catch(() => {
        setHasTileError(true);
      });

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [shouldRenderMapLibre]);

  const showTileErrorNotice = shouldRenderMapLibre && hasTileError;

  return (
    <section className="map-card" aria-label="Mapa interactivo de Santiago2D">
      <div className="map-frame">
        {shouldRenderDemoPixelMap ? (
          <DemoPixelMap />
        ) : (
          <div ref={mapContainerRef} className="game-map" />
        )}
        {shouldRenderDemoPixelMap && (
          <div className="demo-mode-card" role="status">
            <strong>Modo demo sin tiles</strong>
            <span>
              Maqueta local pixel art. Define <code>VITE_TILE_URL</code> para
              activar MapLibre con una fuente legal de vector tiles.
            </span>
          </div>
        )}
        {showTileErrorNotice && (
          <div className="map-notice map-notice--warning" role="status">
            <strong>No pudimos cargar los tiles</strong>
            <span>
              Revisa que <code>VITE_TILE_URL</code> apunte a una fuente legal,
              activa y compatible con MapLibre. La app sigue disponible.
            </span>
          </div>
        )}
        <div className="pixel-badge">{mapConfig.zoneName}</div>
      </div>
    </section>
  );
}
