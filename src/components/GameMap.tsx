import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  createEmptyGameStyle,
  createSantiagoGameStyle,
  PROVIDENCIA_CENTER,
} from '../map/style';

const tileUrl = import.meta.env.VITE_TILE_URL?.trim();

export function GameMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: tileUrl ? createSantiagoGameStyle(tileUrl) : createEmptyGameStyle(),
      center: PROVIDENCIA_CENTER,
      zoom: 14,
      minZoom: 10,
      maxZoom: 18,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
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

  return (
    <section className="map-card" aria-label="Mapa interactivo de Santiago2D">
      <div className="map-frame">
        <div ref={mapContainerRef} className="game-map" />
        {!tileUrl && (
          <div className="map-notice" role="status">
            <strong>Configura tus vector tiles</strong>
            <span>
              Define <code>VITE_TILE_URL</code> en un archivo <code>.env.local</code>{' '}
              para cargar una fuente legal compatible con MapLibre.
            </span>
          </div>
        )}
        <div className="pixel-badge">Providencia · Santiago</div>
      </div>
    </section>
  );
}
