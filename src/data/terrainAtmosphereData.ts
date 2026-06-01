type TerrainProperties = Record<string, string | number>;

type TerrainPointFeature = {
  type: 'Feature';
  properties: TerrainProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type TerrainLineFeature = {
  type: 'Feature';
  properties: TerrainProperties;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
};

type TerrainPolygonFeature = {
  type: 'Feature';
  properties: TerrainProperties;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
};

type TerrainFeature = TerrainPointFeature | TerrainLineFeature | TerrainPolygonFeature;

export type TerrainFeatureCollection = {
  type: 'FeatureCollection';
  features: TerrainFeature[];
};

const pointFeature = (coordinates: [number, number], properties: TerrainProperties): TerrainPointFeature => ({
  type: 'Feature',
  properties,
  geometry: { type: 'Point', coordinates },
});

const lineFeature = (coordinates: [number, number][], properties: TerrainProperties): TerrainLineFeature => ({
  type: 'Feature',
  properties,
  geometry: { type: 'LineString', coordinates },
});

const polygonFeature = (coordinates: [number, number][], properties: TerrainProperties): TerrainPolygonFeature => ({
  type: 'Feature',
  properties,
  geometry: { type: 'Polygon', coordinates: [coordinates] },
});

const canopyCoordinates: [number, number][] = [
  [-70.6268, -33.4161], [-70.6225, -33.4144], [-70.6184, -33.4129], [-70.6142, -33.4119],
  [-70.6101, -33.4109], [-70.6063, -33.4105], [-70.6022, -33.4102], [-70.5981, -33.4105],
  [-70.5942, -33.4113], [-70.5908, -33.4127], [-70.5875, -33.4145], [-70.5844, -33.4165],
  [-70.6202, -33.4194], [-70.6156, -33.4187], [-70.6115, -33.4179], [-70.6072, -33.4174],
  [-70.6029, -33.4171], [-70.5985, -33.4178], [-70.5941, -33.4191], [-70.5902, -33.4211],
  [-70.6111, -33.4285], [-70.6089, -33.4288], [-70.6068, -33.4290], [-70.5898, -33.4286],
];

const urbanGrainCoordinates: [number, number][] = [
  [-70.6118, -33.4230], [-70.6099, -33.4241], [-70.6078, -33.4251], [-70.6059, -33.4260],
  [-70.6037, -33.4231], [-70.6015, -33.4217], [-70.5992, -33.4204], [-70.5968, -33.4196],
  [-70.6141, -33.4281], [-70.6112, -33.4284], [-70.6082, -33.4286], [-70.6051, -33.4289],
];

export const terrainAtmosphereDetails: TerrainFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    polygonFeature([
      [-70.633, -33.407],
      [-70.617, -33.401],
      [-70.598, -33.402],
      [-70.580, -33.411],
      [-70.574, -33.423],
      [-70.590, -33.426],
      [-70.610, -33.423],
      [-70.628, -33.419],
      [-70.633, -33.407],
    ], { kind: 'hillMass', name: 'Parque Metropolitano estilizado' }),
    polygonFeature([
      [-70.632, -33.412],
      [-70.611, -33.407],
      [-70.589, -33.410],
      [-70.579, -33.420],
      [-70.593, -33.424],
      [-70.616, -33.421],
      [-70.632, -33.412],
    ], { kind: 'hillShade', name: 'Sombreado cerro' }),
    polygonFeature([
      [-70.617, -33.420],
      [-70.600, -33.417],
      [-70.584, -33.421],
      [-70.579, -33.426],
      [-70.595, -33.430],
      [-70.615, -33.426],
      [-70.617, -33.420],
    ], { kind: 'hillFoothill', name: 'Pie de cerro' }),
    polygonFeature([
      [-70.617, -33.421],
      [-70.595, -33.418],
      [-70.583, -33.427],
      [-70.599, -33.437],
      [-70.624, -33.431],
      [-70.617, -33.421],
    ], { kind: 'urbanTone', name: 'Providencia urbana norte' }),
    polygonFeature([
      [-70.616, -33.427],
      [-70.590, -33.430],
      [-70.587, -33.443],
      [-70.618, -33.443],
      [-70.626, -33.433],
      [-70.616, -33.427],
    ], { kind: 'urbanWarmTone', name: 'Providencia urbana sur' }),
    lineFeature([[-70.628, -33.412], [-70.617, -33.409], [-70.602, -33.409], [-70.588, -33.414]], { kind: 'contour', name: 'Curva cerro alta' }),
    lineFeature([[-70.626, -33.416], [-70.613, -33.413], [-70.598, -33.414], [-70.584, -33.419]], { kind: 'contour', name: 'Curva cerro media' }),
    lineFeature([[-70.620, -33.420], [-70.606, -33.418], [-70.592, -33.421], [-70.582, -33.425]], { kind: 'contour', name: 'Curva cerro baja' }),
    ...canopyCoordinates.map((coordinates, index) => pointFeature(coordinates, { kind: 'canopy', name: `Copa ${index + 1}` })),
    ...urbanGrainCoordinates.map((coordinates, index) => pointFeature(coordinates, { kind: 'urbanGrain', name: `Grano urbano ${index + 1}` })),
  ],
};
