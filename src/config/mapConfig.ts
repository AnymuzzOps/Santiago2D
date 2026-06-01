type LngLatTuple = [number, number];
type BoundsTuple = [LngLatTuple, LngLatTuple];

export const mapConfig = {
  zoneName: 'Providencia · Santiago',
  initialCenter: [-70.6037, -33.4194] as LngLatTuple,
  initialZoom: 15.85,
  dioramaPitch: 58,
  dioramaBearing: -20,
  minZoom: 10,
  maxZoom: 18,
  navigationBounds: [
    [-70.6705, -33.475],
    [-70.535, -33.374],
  ] as BoundsTuple,
  defaultAttribution: '© OpenStreetMap contributors',
};
