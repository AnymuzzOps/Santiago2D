type LngLatTuple = [number, number];
type BoundsTuple = [LngLatTuple, LngLatTuple];

export const mapConfig = {
  zoneName: 'Providencia · Santiago',
  initialCenter: [-70.6042, -33.4212] as LngLatTuple,
  initialZoom: 15.45,
  dioramaPitch: 55,
  dioramaBearing: -18,
  minZoom: 10,
  maxZoom: 18,
  navigationBounds: [
    [-70.6705, -33.475],
    [-70.535, -33.374],
  ] as BoundsTuple,
  defaultAttribution: '© OpenStreetMap contributors',
};
