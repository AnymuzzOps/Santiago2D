import { useState } from 'react';
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

export function DemoPixelMap() {
  const [selectedFeature, setSelectedFeature] = useState<DemoMapElement | null>(null);

  return (
    <div className="demo-map" aria-label="Modo demo sin tiles: vertical slice pixel art de Providencia">
      <div className="demo-map__water" aria-hidden="true" />
      {demoPlazas.map((plaza) => (
        <button
          key={plaza.id}
          className={`demo-map__plaza demo-map__plaza--${plaza.variant} demo-feature-button`}
          type="button"
          onClick={() => setSelectedFeature(plaza)}
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
          onClick={() => setSelectedFeature(parking)}
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
            onClick={() => setSelectedFeature(building)}
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
          onClick={() => setSelectedFeature(marker)}
          aria-label={`Ver información de ${marker.label}`}
        >
          <span className="demo-marker__pin" aria-hidden="true" />
          <span className="demo-marker__label">{marker.label}</span>
        </button>
      ))}
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
