import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapConfig } from '../config/mapConfig';
import { createEmptyGameStyle, createSantiagoGameStyle } from '../map/style';

const tileUrl = import.meta.env.VITE_TILE_URL?.trim();

export function GameMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [hasTileError, setHasTileError] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: tileUrl ? createSantiagoGameStyle(tileUrl) : createEmptyGameStyle(),
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
      if (!tileUrl) {
        return;
      }

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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const showMissingTilesNotice = !tileUrl;
  const showTileErrorNotice = tileUrl && hasTileError;

  return (
    <section className="map-card" aria-label="Mapa interactivo de Santiago2D">
      <div className="map-frame">
        <div ref={mapContainerRef} className="game-map" />
        {showMissingTilesNotice && (
          <div className="map-notice" role="status">
            <strong>Configura tus vector tiles</strong>
            <span>
              Define <code>VITE_TILE_URL</code> en un archivo <code>.env.local</code>{' '}
              para cargar una fuente legal compatible con MapLibre.
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
