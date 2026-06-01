import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';
import { mapConfig } from '../config/mapConfig';
import { customPois, customPoiTypeLabels, type CustomPoi } from '../data/customPois';
import { createSantiagoGameStyle, type TileSourceKind } from '../map/style';
import { DemoPixelMap } from './DemoPixelMap';
import { DioramaLayer } from './DioramaLayer';
import { MapPoiMarker, type MapPoiMarkerConstructor } from './MapPoiMarker';

const tileUrl = import.meta.env.VITE_TILE_URL?.trim();
const tileAttribution = import.meta.env.VITE_TILE_ATTRIBUTION?.trim() || mapConfig.defaultAttribution;
const isPoiEditorEnabled = import.meta.env.VITE_ENABLE_POI_EDITOR === 'true';
const requiredTilePlaceholders = ['{z}', '{x}', '{y}'];

type TileSourceMode = TileSourceKind | 'empty' | 'invalid';

type PoiEditorDraft = {
  lng: number;
  lat: number;
  snippet: string;
};

const hasXyzTilePlaceholders = (url: string) =>
  requiredTilePlaceholders.every((placeholder) => url.includes(placeholder));


const formatCoordinate = (coordinate: number) => Number(coordinate.toFixed(6));

const createPoiSnippet = (lng: number, lat: number) => `{
  id: "poi-nuevo",
  type: "custom",
  name: "Nuevo lugar",
  description: "Descripción pendiente.",
  coordinates: [${formatCoordinate(lng)}, ${formatCoordinate(lat)}],
  icon: "star",
  visible: true,
}`;

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
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const [markerConstructor, setMarkerConstructor] = useState<MapPoiMarkerConstructor | null>(null);
  const [hasTileError, setHasTileError] = useState(false);
  const [selectedCustomPoi, setSelectedCustomPoi] = useState<CustomPoi | null>(null);
  const [poiEditorDraft, setPoiEditorDraft] = useState<PoiEditorDraft | null>(null);
  const [isDioramaEnabled, setIsDioramaEnabled] = useState(true);

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
          pitch: mapConfig.dioramaPitch,
          bearing: mapConfig.dioramaBearing,
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
            visualizePitch: true,
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

        mapRef.current = map;
        setMapInstance(map);
        setMarkerConstructor(() => maplibregl.Marker);
      })
      .catch(() => {
        setHasTileError(true);
      });

    return () => {
      isMounted = false;
      setMapInstance(null);
      setMarkerConstructor(null);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [shouldRenderMapLibre, tileSourceMode]);

  useEffect(() => {
    if (!isPoiEditorEnabled || !shouldRenderMapLibre || !mapInstance) {
      return undefined;
    }

    const openPoiEditorDraft = (event: MapMouseEvent) => {
      const lng = formatCoordinate(event.lngLat.lng);
      const lat = formatCoordinate(event.lngLat.lat);
      setPoiEditorDraft({
        lng,
        lat,
        snippet: createPoiSnippet(lng, lat),
      });
    };

    const handleContextMenu = (event: MapMouseEvent) => {
      event.originalEvent.preventDefault();
      openPoiEditorDraft(event);
    };

    const handleAltClick = (event: MapMouseEvent) => {
      if (!event.originalEvent.altKey) {
        return;
      }

      openPoiEditorDraft(event);
    };

    mapInstance.on('contextmenu', handleContextMenu);
    mapInstance.on('click', handleAltClick);

    return () => {
      mapInstance.off('contextmenu', handleContextMenu);
      mapInstance.off('click', handleAltClick);
    };
  }, [mapInstance, shouldRenderMapLibre]);

  const visibleCustomPois = useMemo(() => customPois.filter((poi) => poi.visible), []);
  const handleSelectCustomPoi = useCallback((poi: CustomPoi) => {
    setSelectedCustomPoi(poi);
  }, []);
  const handleCopyPoiSnippet = useCallback(() => {
    if (!poiEditorDraft) {
      return;
    }

    void navigator.clipboard?.writeText(poiEditorDraft.snippet);
  }, [poiEditorDraft]);

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
        {shouldRenderMapLibre && (
          <>
            <DioramaLayer enabled={isDioramaEnabled} map={mapInstance} />
            <MapPoiMarker
              map={mapInstance}
              markerConstructor={markerConstructor}
              pois={visibleCustomPois}
              selectedPoiId={selectedCustomPoi?.id}
              onSelect={handleSelectCustomPoi}
            />
          </>
        )}
        {shouldRenderMapLibre && isDioramaEnabled && (
          <div className="diorama-mode-badge" role="status">
            Modo diorama experimental
          </div>
        )}
        {shouldRenderMapLibre && (
          <button
            type="button"
            className={`diorama-toggle ${isDioramaEnabled ? 'diorama-toggle--active' : ''}`}
            onClick={() => setIsDioramaEnabled((enabled) => !enabled)}
            aria-pressed={isDioramaEnabled}
            aria-label="Activar o desactivar capa diorama experimental"
          >
            <span>Diorama 2.5D</span>
            <strong>{isDioramaEnabled ? 'Activo' : 'Plano'}</strong>
          </button>
        )}
        {shouldRenderMapLibre && selectedCustomPoi && (
          <aside className="real-map-info-panel" aria-live="polite" aria-label="Información del punto seleccionado">
            <span className={`real-map-info-panel__type real-map-info-panel__type--${selectedCustomPoi.type}`}>
              {customPoiTypeLabels[selectedCustomPoi.type]}
            </span>
            <strong>{selectedCustomPoi.name}</strong>
            <p>{selectedCustomPoi.description}</p>
            <button
              type="button"
              onClick={() => setSelectedCustomPoi(null)}
              aria-label="Cerrar información del punto seleccionado"
            >
              Cerrar
            </button>
          </aside>
        )}
        {shouldRenderMapLibre && isPoiEditorEnabled && poiEditorDraft && (
          <aside className="poi-editor-panel" aria-live="polite" aria-label="Editor manual de POIs">
            <span className="poi-editor-panel__eyebrow">Editor POI activo</span>
            <strong>Coordenadas capturadas</strong>
            <p>
              Lng: <code>{poiEditorDraft.lng}</code> · Lat: <code>{poiEditorDraft.lat}</code>
            </p>
            <pre><code>{poiEditorDraft.snippet}</code></pre>
            <div className="poi-editor-panel__actions">
              <button type="button" onClick={handleCopyPoiSnippet} aria-label="Copiar snippet de POI">
                Copiar snippet
              </button>
              <button type="button" onClick={() => setPoiEditorDraft(null)} aria-label="Cerrar editor de POI">
                Cerrar
              </button>
            </div>
          </aside>
        )}
        <div className="pixel-badge">{mapConfig.zoneName}</div>
      </div>
    </section>
  );
}
