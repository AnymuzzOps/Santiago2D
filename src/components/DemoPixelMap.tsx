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

export function DemoPixelMap() {
  return (
    <div className="demo-map" aria-label="Modo demo sin tiles: vertical slice pixel art de Providencia">
      <div className="demo-map__water" aria-hidden="true" />
      {demoPlazas.map((plaza) => (
        <div
          key={plaza.id}
          className={`demo-map__plaza demo-map__plaza--${plaza.variant}`}
          aria-hidden="true"
        >
          <span className="demo-plaza__path demo-plaza__path--horizontal" />
          {plaza.variant === 'large' && <span className="demo-plaza__path demo-plaza__path--vertical" />}
          <span className={plaza.variant === 'large' ? 'demo-plaza__fountain' : 'demo-plaza__kiosk'} />
        </div>
      ))}
      {demoParkings.map((parking) => (
        <div
          key={parking.id}
          className={`demo-map__parking demo-map__parking--${parking.variant}`}
          aria-hidden="true"
        >
          {Array.from({ length: parking.variant === 'north' ? 4 : 3 }, (_, index) => (
            <span key={`${parking.id}-space-${index + 1}`} />
          ))}
        </div>
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
      <div className="demo-map__blocks" aria-hidden="true">
        {demoBuildings.map((building) => (
          <span key={building.id} className={`demo-building demo-building--${building.variant}`} />
        ))}
      </div>
      {demoTrees.map((tree) => (
        <span key={tree.id} className="demo-tree" style={getPositionStyle(tree)} aria-hidden="true" />
      ))}
      {demoLamps.map((lamp) => (
        <span key={lamp.id} className="demo-lamp" style={getPositionStyle(lamp)} aria-hidden="true" />
      ))}
      {demoMarkers.map((marker) => (
        <div
          key={marker.id}
          className={`demo-marker demo-marker--${marker.variant}`}
          style={getPositionStyle(marker)}
        >
          <span className="demo-marker__pin" aria-hidden="true" />
          <span className="demo-marker__label">{marker.label}</span>
        </div>
      ))}
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
