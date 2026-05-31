const demoMarkers = [
  { label: 'Metro', className: 'demo-marker--metro', x: '17%', y: '67%' },
  { label: 'Plaza', className: 'demo-marker--park', x: '36%', y: '28%' },
  { label: 'Café', className: 'demo-marker--cafe', x: '62%', y: '58%' },
  { label: 'Torre', className: 'demo-marker--tower', x: '77%', y: '35%' },
];

const demoTrees = [
  ['28%', '24%'],
  ['33%', '31%'],
  ['42%', '25%'],
  ['84%', '73%'],
  ['89%', '80%'],
  ['78%', '84%'],
  ['12%', '23%'],
  ['58%', '82%'],
  ['48%', '41%'],
  ['69%', '18%'],
  ['23%', '82%'],
  ['37%', '76%'],
];

const demoLamps = [
  ['22%', '50%'],
  ['46%', '50%'],
  ['57%', '50%'],
  ['68%', '50%'],
  ['22%', '70%'],
  ['46%', '70%'],
  ['57%', '70%'],
  ['68%', '70%'],
  ['14%', '38%'],
  ['49%', '38%'],
];

const demoBuildings = Array.from({ length: 20 }, (_, index) => ({
  className: `demo-building demo-building--${(index % 5) + 1}`,
}));

export function DemoPixelMap() {
  return (
    <div className="demo-map" aria-label="Modo demo sin tiles: vertical slice pixel art de Providencia">
      <div className="demo-map__water" aria-hidden="true" />
      <div className="demo-map__plaza demo-map__plaza--large" aria-hidden="true">
        <span className="demo-plaza__path demo-plaza__path--horizontal" />
        <span className="demo-plaza__path demo-plaza__path--vertical" />
        <span className="demo-plaza__fountain" />
      </div>
      <div className="demo-map__plaza demo-map__plaza--small" aria-hidden="true">
        <span className="demo-plaza__path demo-plaza__path--horizontal" />
        <span className="demo-plaza__kiosk" />
      </div>
      <div className="demo-map__parking demo-map__parking--north" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="demo-map__parking demo-map__parking--south" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="demo-map__roads" aria-hidden="true">
        <span className="demo-road demo-road--h demo-road--h-1" />
        <span className="demo-road demo-road--h demo-road--h-2" />
        <span className="demo-road demo-road--h demo-road--h-3" />
        <span className="demo-road demo-road--v demo-road--v-1" />
        <span className="demo-road demo-road--v demo-road--v-2" />
        <span className="demo-road demo-road--v demo-road--v-3" />
        <span className="demo-crosswalk demo-crosswalk--1" />
        <span className="demo-crosswalk demo-crosswalk--2" />
        <span className="demo-crosswalk demo-crosswalk--3" />
        <span className="demo-crosswalk demo-crosswalk--4" />
      </div>
      <div className="demo-map__blocks" aria-hidden="true">
        {demoBuildings.map((building, index) => (
          <span key={index} className={building.className} />
        ))}
      </div>
      {demoTrees.map(([x, y], index) => (
        <span key={`tree-${index}`} className="demo-tree" style={{ left: x, top: y }} aria-hidden="true" />
      ))}
      {demoLamps.map(([x, y], index) => (
        <span key={`lamp-${index}`} className="demo-lamp" style={{ left: x, top: y }} aria-hidden="true" />
      ))}
      {demoMarkers.map((marker) => (
        <div
          key={marker.label}
          className={`demo-marker ${marker.className}`}
          style={{ left: marker.x, top: marker.y }}
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
