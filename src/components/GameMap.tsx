import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { mapConfig } from '../config/mapConfig';
import { DemoPixelMap } from './DemoPixelMap';
import { realMapPois, realMapPoiTypeLabels, type RealMapPoi, type RealMapPoiType } from '../data/realMapPoiData';
import { createSantiagoGameStyle, type TileSourceKind } from '../map/style';

const tileUrl = import.meta.env.VITE_TILE_URL?.trim();
const tileAttribution = import.meta.env.VITE_TILE_ATTRIBUTION?.trim() || mapConfig.defaultAttribution;
const requiredTilePlaceholders = ['{z}', '{x}', '{y}'];

const realMapPoiIcons: Record<RealMapPoiType, string> = {
  metro: 'M',
  plaza: '✦',
  cafe: '☕',
  hospital: '+',
  university: 'U',
};

type TileSourceMode = TileSourceKind | 'empty' | 'invalid';

const hasXyzTilePlaceholders = (url: string) =>
  requiredTilePlaceholders.every((placeholder) => url.includes(placeholder));

const detectTileSourceMode = (url?: string): TileSourceMode => {
  if (!url) {
    return 'empty';
  }

  if (hasXyzTilePlaceholders(url)) {
    return 'xyz';
  }

  if (url.toLowerCase().includes('.json')) {
    return 'tilejson';
  }

  return 'invalid';
};

export function GameMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const realMapMarkersRef = useRef<Map<string, MapLibreMarker>>(new Map());
  const realMapMarkerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [hasTileError, setHasTileError] = useState(false);
  const [selectedRealFeature, setSelectedRealFeature] = useState<RealMapPoi | null>(null);

  const tileSourceMode = detectTileSourceMode(tileUrl);
  const shouldRenderDemoPixelMap = tileSourceMode === 'empty';
  const shouldRenderMapLibre = tileSourceMode === 'xyz' || tileSourceMode === 'tilejson';
  const hasTileUrlFormatWarning = tileSourceMode === 'invalid';

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
          style: createSantiagoGameStyle(tileUrl, tileAttribution, tileSourceMode),
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
            customAttribution: tileAttribution,
            compact: false,
          }),
          'bottom-right',
        );

        realMapPois.forEach((poi) => {
          const markerButton = document.createElement('button');
          markerButton.type = 'button';
          markerButton.className = `real-poi-marker real-poi-marker--${poi.type}`;
          markerButton.setAttribute('aria-label', `Ver información de ${poi.label}`);
          markerButton.setAttribute('aria-pressed', 'false');

          const icon = document.createElement('span');
          icon.className = 'real-poi-marker__icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.textContent = realMapPoiIcons[poi.type];

          const label = document.createElement('span');
          label.className = 'real-poi-marker__label';
          label.textContent = poi.label;

          markerButton.append(icon, label);
          markerButton.addEventListener('click', (event) => {
            event.stopPropagation();
            setSelectedRealFeature(poi);
          });

          const marker = new maplibregl.Marker({
            element: markerButton,
            anchor: 'bottom',
          })
            .setLngLat(poi.coordinates)
            .addTo(map);

          realMapMarkersRef.current.set(poi.id, marker);
          realMapMarkerElementsRef.current.set(poi.id, markerButton);
        });

        mapRef.current = map;
      })
      .catch(() => {
        setHasTileError(true);
      });

    return () => {
      isMounted = false;
      realMapMarkersRef.current.forEach((marker) => marker.remove());
      realMapMarkersRef.current.clear();
      realMapMarkerElementsRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [shouldRenderMapLibre, tileSourceMode]);

  useEffect(() => {
    realMapMarkerElementsRef.current.forEach((element, poiId) => {
      const isSelected = selectedRealFeature?.id === poiId;
      element.classList.toggle('real-poi-marker--selected', isSelected);
      element.setAttribute('aria-pressed', String(isSelected));
    });
  }, [selectedRealFeature]);

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
        {hasTileUrlFormatWarning && (
          <div className="map-notice map-notice--warning" role="status">
            <strong>Formato de tiles no compatible</strong>
            <span>
              Usa una URL XYZ con <code>{'{z}'}</code>, <code>{'{x}'}</code> y <code>{'{y}'}</code>,
              o una URL TileJSON que contenga <code>.json</code>.
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
        {shouldRenderMapLibre && selectedRealFeature && (
          <aside className="real-map-info-panel" aria-live="polite" aria-label="Información del punto seleccionado">
            <span className={`real-map-info-panel__type real-map-info-panel__type--${selectedRealFeature.type}`}>
              {realMapPoiTypeLabels[selectedRealFeature.type]}
            </span>
            <strong>{selectedRealFeature.label}</strong>
            <p>{selectedRealFeature.description}</p>
            <button
              type="button"
              onClick={() => setSelectedRealFeature(null)}
              aria-label="Cerrar información del punto seleccionado"
            >
              Cerrar
            </button>
          </aside>
        )}
        <div className="pixel-badge">{mapConfig.zoneName}</div>
      </div>
    </section>
  );
}
