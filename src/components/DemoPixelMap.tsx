const demoMarkers = [
  { label: 'Metro', className: 'demo-marker--metro', x: '18%', y: '64%' },
  { label: 'Plaza', className: 'demo-marker--park', x: '36%', y: '28%' },
  { label: 'Café', className: 'demo-marker--cafe', x: '62%', y: '58%' },
  { label: 'Edificio', className: 'demo-marker--tower', x: '76%', y: '34%' },
];

export function DemoPixelMap() {
  return (
    <div className="demo-map" aria-label="Modo demo sin tiles: maqueta pixel art de Providencia">
      <div className="demo-map__water" aria-hidden="true" />
      <div className="demo-map__park demo-map__park--large" aria-hidden="true" />
      <div className="demo-map__park demo-map__park--small" aria-hidden="true" />
      <div className="demo-map__road demo-map__road--h demo-map__road--h-1" aria-hidden="true" />
      <div className="demo-map__road demo-map__road--h demo-map__road--h-2" aria-hidden="true" />
      <div className="demo-map__road demo-map__road--h demo-map__road--h-3" aria-hidden="true" />
      <div className="demo-map__road demo-map__road--v demo-map__road--v-1" aria-hidden="true" />
      <div className="demo-map__road demo-map__road--v demo-map__road--v-2" aria-hidden="true" />
      <div className="demo-map__road demo-map__road--v demo-map__road--v-3" aria-hidden="true" />
      <div className="demo-map__blocks" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`demo-building demo-building--${(index % 4) + 1}`} />
        ))}
      </div>
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
    </div>
  );
}
