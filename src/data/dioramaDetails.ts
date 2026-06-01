type DioramaProperties = Record<string, string | number>;

type DioramaPointFeature = {
  type: 'Feature';
  properties: DioramaProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type DioramaLineFeature = {
  type: 'Feature';
  properties: DioramaProperties;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
};

type DioramaPolygonFeature = {
  type: 'Feature';
  properties: DioramaProperties;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
};

type DioramaFeature = DioramaPointFeature | DioramaLineFeature | DioramaPolygonFeature;

export type DioramaFeatureCollection = {
  type: 'FeatureCollection';
  features: DioramaFeature[];
};

const pointFeature = (coordinates: [number, number], properties: DioramaProperties): DioramaPointFeature => ({
  type: 'Feature',
  properties,
  geometry: {
    type: 'Point',
    coordinates,
  },
});

const lineFeature = (coordinates: [number, number][], properties: DioramaProperties): DioramaLineFeature => ({
  type: 'Feature',
  properties,
  geometry: {
    type: 'LineString',
    coordinates,
  },
});

const polygonFeature = (coordinates: [number, number][], properties: DioramaProperties): DioramaPolygonFeature => ({
  type: 'Feature',
  properties,
  geometry: {
    type: 'Polygon',
    coordinates: [coordinates],
  },
});

const treeCoordinates: [number, number][] = [
  [-70.6107, -33.4219], [-70.6099, -33.4225], [-70.6088, -33.4231], [-70.6078, -33.4235],
  [-70.6067, -33.4252], [-70.6048, -33.4261], [-70.6029, -33.4267], [-70.6004, -33.4271],
  [-70.5897, -33.4287], [-70.5891, -33.4294], [-70.5884, -33.4289], [-70.5901, -33.4296],
  [-70.6132, -33.4285], [-70.6114, -33.4286], [-70.6097, -33.4287], [-70.6079, -33.4288],
  [-70.6068, -33.4185], [-70.6047, -33.4178], [-70.6025, -33.4172], [-70.6009, -33.4169],
  [-70.6038, -33.4210], [-70.6026, -33.4204], [-70.6013, -33.4197], [-70.5994, -33.4190],
];

const carCoordinates: Array<[number, number, string]> = [
  [-70.6098, -33.4243, 'yellow'], [-70.6083, -33.4252, 'blue'], [-70.6069, -33.4262, 'red'],
  [-70.6048, -33.4232, 'white'], [-70.6028, -33.4225, 'blue'], [-70.6005, -33.4217, 'yellow'],
  [-70.6121, -33.4279, 'red'], [-70.6101, -33.4281, 'white'], [-70.6076, -33.4285, 'blue'],
];

const crosswalkCoordinates: [number, number][][] = [
  [[-70.6097, -33.4234], [-70.6092, -33.4238]],
  [[-70.6071, -33.4256], [-70.6065, -33.4261]],
  [[-70.6045, -33.4265], [-70.6040, -33.4270]],
  [[-70.6018, -33.4193], [-70.6012, -33.4198]],
  [[-70.5904, -33.4290], [-70.5897, -33.4295]],
];

const plazaDetailCoordinates: [number, number][] = [
  [-70.5898, -33.4287], [-70.5892, -33.4290], [-70.5887, -33.4294],
  [-70.6129, -33.4285], [-70.6111, -33.4286], [-70.6093, -33.4288], [-70.6074, -33.4289],
];

const focusGlowCoordinates: [number, number][] = [
  [-70.6065, -33.4172], [-70.6044, -33.4184], [-70.6086, -33.4219], [-70.6022, -33.4198],
];

const waterSparkleCoordinates: [number, number][] = [
  [-70.6067, -33.4168], [-70.6035, -33.4161], [-70.6002, -33.4156], [-70.5968, -33.4153],
];

export const dioramaDetails: DioramaFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    polygonFeature([
      [-70.5906, -33.4282],
      [-70.5882, -33.4279],
      [-70.5878, -33.4297],
      [-70.5902, -33.4301],
      [-70.5906, -33.4282],
    ], { kind: 'plazaTexture', name: 'Plaza Las Lilas' }),
    polygonFeature([
      [-70.6138, -33.4282],
      [-70.6064, -33.4286],
      [-70.6063, -33.4292],
      [-70.6137, -33.4288],
      [-70.6138, -33.4282],
    ], { kind: 'plazaTexture', name: 'Bandejon Pocuro' }),
    polygonFeature([
      [-70.6088, -33.4160],
      [-70.6022, -33.4164],
      [-70.6018, -33.4204],
      [-70.6084, -33.4221],
      [-70.6088, -33.4160],
    ], { kind: 'focusZone', name: 'Costanera Los Leones focus' }),
    ...treeCoordinates.map((coordinates, index) => pointFeature(coordinates, { kind: 'tree', name: `Arbol ${index + 1}` })),
    ...plazaDetailCoordinates.map((coordinates, index) => pointFeature(coordinates, { kind: 'plazaDetail', name: `Textura plaza ${index + 1}` })),
    ...carCoordinates.map(([lng, lat, color], index) => pointFeature([lng, lat], { kind: 'car', color, name: `Auto ${index + 1}` })),
    ...focusGlowCoordinates.map((coordinates, index) => pointFeature(coordinates, { kind: 'focusGlow', name: `Brillo urbano ${index + 1}` })),
    ...crosswalkCoordinates.map((coordinates, index) => lineFeature(coordinates, { kind: 'crosswalk', name: `Paso peatonal ${index + 1}` })),
    ...waterSparkleCoordinates.map((coordinates, index) => pointFeature(coordinates, { kind: 'waterSparkle', name: `Brillo agua ${index + 1}` })),
  ],
};
