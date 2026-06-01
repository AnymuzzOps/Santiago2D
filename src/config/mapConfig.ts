type LngLatTuple = [number, number];
type BoundsTuple = [LngLatTuple, LngLatTuple];

export const mapConfig = {
  zoneName: 'Providencia · Santiago',
  initialCenter: [-70.6037, -33.4194] as LngLatTuple,
  initialZoom: 15.85,
  dioramaPitch: 58,
  dioramaBearing: -20,
  cameraPresets: {
    costaneraHigh: {
      label: 'Costanera desde altura',
      center: [-70.6037, -33.4194] as LngLatTuple,
      zoom: 15.85,
      pitch: 58,
      bearing: -20,
    },
    sanCristobalProvidencia: {
      label: 'Cerro San Cristóbal / Providencia',
      center: [-70.606, -33.4147] as LngLatTuple,
      zoom: 14.95,
      pitch: 52,
      bearing: -12,
    },
  },
  minZoom: 10,
  maxZoom: 18,
  navigationBounds: [
    [-70.6705, -33.475],
    [-70.535, -33.374],
  ] as BoundsTuple,
  defaultAttribution: '© OpenStreetMap contributors',
};
