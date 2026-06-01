import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  demoBuildings,
  demoCrosswalks,
  demoLamps,
  demoMarkers,
  demoParkings,
  demoPlazas,
  demoRoads,
  demoTrees,
  type DemoMapElement,
} from '../data/demoMapData';

const DEMO_MIN_ZOOM = 0.85;
const DEMO_MAX_ZOOM = 1.8;
const DEMO_ZOOM_STEP = 0.15;
const DEMO_DRAG_THRESHOLD = 5;

const initialMapView = {
  x: 0,
  y: 0,
  scale: 1,
};

const getPositionStyle = (element: DemoMapElement) => ({
  left: element.x,
  top: element.y,
  width: element.width,
  height: element.height,
});

const featureTypeLabels: Record<DemoMapElement['type'], string> = {
  building: 'Edificio',
  tree: 'Árbol',
  lamp: 'Luminaria',
  marker: 'Marcador',
  plaza: 'Plaza / parque',
  parking: 'Estacionamiento',
  road: 'Calle',
  crosswalk: 'Paso peatonal',
};

type MapView = typeof initialMapView;

type DragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startViewX: number;
  startViewY: number;
};

const clampZoom = (scale: number) => Math.min(DEMO_MAX_ZOOM, Math.max(DEMO_MIN_ZOOM, scale));

const clampPan = (x: number, y: number, scale: number): Pick<MapView, 'x' | 'y'> => {
  const scaledOffset = Math.max(0, (scale - 1) * 220);
  const horizontalLimit = 180 + scaledOffset;
  const verticalLimit = 150 + scaledOffset;

  return {
    x: Math.min(horizontalLimit, Math.max(-horizontalLimit, x)),
    y: Math.min(verticalLimit, Math.max(-verticalLimit, y)),
  };
};

export function DemoPixelMap() {
  const [selectedFeature, setSelectedFeature] = useState<DemoMapElement | null>(null);
  const [mapView, setMapView] = useState<MapView>(initialMapView);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);
  const didDragRef = useRef(false);

  const viewportStyle = {
    transform: `translate(${mapView.x}px, ${mapView.y}px) scale(${mapView.scale})`,
  } satisfies CSSProperties;

  const updateZoom = (zoomDelta: number) => {
    setMapView((currentView) => {
      const nextScale = clampZoom(Number((currentView.scale + zoomDelta).toFixed(2)));
      const nextPan = clampPan(currentView.x, currentView.y, nextScale);

      return {
        ...nextPan,
        scale: nextScale,
      };
    });
  };

  const resetMapView = () => {
    setMapView(initialMapView);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') {
      return;
    }

    didDragRef.current = false;
    setIsDragging(true);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startViewX: mapView.x,
      startViewY: mapView.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const movementX = event.clientX - dragState.startClientX;
    const movementY = event.clientY - dragState.startClientY;

    if (Math.hypot(movementX, movementY) > DEMO_DRAG_THRESHOLD) {
      didDragRef.current = true;
    }

    const nextPan = clampPan(
      dragState.startViewX + movementX,
      dragState.startViewY + movementY,
      mapView.scale,
    );

    setMapView((currentView) => ({
      ...currentView,
      ...nextPan,
    }));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      setIsDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleFeatureClick = (feature: DemoMapElement) => {
    if (didDragRef.current) {
      return;
    }

    setSelectedFeature(feature);
  };

  return (
    <div className="demo-map" aria-label="Modo demo sin tiles: vertical slice pixel art de Providencia">
      <div
        className={`demo-map__viewport${isDragging ? ' demo-map__viewport--dragging' : ''}`}
        style={viewportStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="demo-map__water" aria-hidden="true" />
        {demoPlazas.map((plaza) => (
          <button
            key={plaza.id}
            className={`demo-map__plaza demo-map__plaza--${plaza.variant} demo-feature-button`}
            type="button"
            onClick={() => handleFeatureClick(plaza)}
            aria-label={`Ver información de ${plaza.label}`}
          >
            <span className="demo-plaza__path demo-plaza__path--horizontal" aria-hidden="true" />
            {plaza.variant === 'large' && (
              <span className="demo-plaza__path demo-plaza__path--vertical" aria-hidden="true" />
            )}
            <span
              className={plaza.variant === 'large' ? 'demo-plaza__fountain' : 'demo-plaza__kiosk'}
              aria-hidden="true"
            />
          </button>
        ))}
        {demoParkings.map((parking) => (
          <button
            key={parking.id}
            className={`demo-map__parking demo-map__parking--${parking.variant} demo-feature-button`}
            type="button"
            onClick={() => handleFeatureClick(parking)}
            aria-label={`Ver información de ${parking.label}`}
          >
            {Array.from({ length: parking.variant === 'north' ? 4 : 3 }, (_, index) => (
              <span key={`${parking.id}-space-${index + 1}`} aria-hidden="true" />
            ))}
          </button>
        ))}
        <div className="demo-map__roads" aria-hidden="true">
          {demoRoads.map((road) => (
            <span
              key={road.id}
              className={`demo-road demo-road--${road.variant === 'horizontal' ? 'h' : 'v'}`}
              style={getPositionStyle(road)}
            />
          ))}
          {demoCrosswalks.map((crosswalk) => (
            <span key={crosswalk.id} className="demo-crosswalk" style={getPositionStyle(crosswalk)} />
          ))}
        </div>
        <div className="demo-map__blocks">
          {demoBuildings.map((building) => (
            <button
              key={building.id}
              className={`demo-building demo-building--${building.variant} demo-feature-button`}
              type="button"
              onClick={() => handleFeatureClick(building)}
              aria-label={`Ver información de ${building.label}`}
            />
          ))}
        </div>
        {demoTrees.map((tree) => (
          <span key={tree.id} className="demo-tree" style={getPositionStyle(tree)} aria-hidden="true" />
        ))}
        {demoLamps.map((lamp) => (
          <span key={lamp.id} className="demo-lamp" style={getPositionStyle(lamp)} aria-hidden="true" />
        ))}
        {demoMarkers.map((marker) => (
          <button
            key={marker.id}
            className={`demo-marker demo-marker--${marker.variant} demo-feature-button`}
            style={getPositionStyle(marker)}
            type="button"
            onClick={() => handleFeatureClick(marker)}
            aria-label={`Ver información de ${marker.label}`}
          >
            <span className="demo-marker__pin" aria-hidden="true" />
            <span className="demo-marker__label">{marker.label}</span>
          </button>
        ))}
      </div>
      <div className="demo-map-controls" aria-label="Controles del mapa demo">
        <button type="button" onClick={() => updateZoom(DEMO_ZOOM_STEP)} aria-label="Acercar mapa demo">
          +
        </button>
        <button type="button" onClick={() => updateZoom(-DEMO_ZOOM_STEP)} aria-label="Alejar mapa demo">
          −
        </button>
        <button className="demo-map-controls__center" type="button" onClick={resetMapView}>
          Centrar Providencia
        </button>
      </div>
      {selectedFeature && (
        <aside className="demo-info-panel" aria-live="polite" aria-label="Información del elemento seleccionado">
          <button
            className="demo-info-panel__close"
            type="button"
            onClick={() => setSelectedFeature(null)}
            aria-label="Cerrar información"
          >
            ×
          </button>
          <span className="demo-info-panel__eyebrow">{featureTypeLabels[selectedFeature.type]}</span>
          <strong>{selectedFeature.label}</strong>
          <p>{selectedFeature.description}</p>
        </aside>
      )}
      <aside className="demo-legend" aria-label="Leyenda del mapa demo">
        <strong>Providencia pixel slice</strong>
        <span><i className="demo-legend__swatch demo-legend__swatch--road" />Calles</span>
        <span><i className="demo-legend__swatch demo-legend__swatch--park" />Plazas y árboles</span>
        <span><i className="demo-legend__swatch demo-legend__swatch--water" />Agua</span>
        <span><i className="demo-legend__swatch demo-legend__swatch--building" />Edificios</span>
      </aside>
    </div>
  );
}
