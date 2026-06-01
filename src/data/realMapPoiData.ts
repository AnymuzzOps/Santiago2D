export type RealMapPoiType = 'metro' | 'plaza' | 'cafe' | 'hospital' | 'university';

export type RealMapPoi = {
  id: string;
  type: RealMapPoiType;
  label: string;
  description: string;
  coordinates: [number, number];
};

export const realMapPois: RealMapPoi[] = [
  {
    id: 'metro-los-leones',
    type: 'metro',
    label: 'Metro Los Leones',
    description: 'Nodo de transporte clave para recorrer Providencia como si fuera un punto de viaje rápido.',
    coordinates: [-70.6088, -33.4222],
  },
  {
    id: 'plaza-las-lilas',
    type: 'plaza',
    label: 'Plaza Las Lilas',
    description: 'Área verde de barrio destacada como zona segura y hito visual dentro del mapa real.',
    coordinates: [-70.5888, -33.4292],
  },
  {
    id: 'cafe-providencia',
    type: 'cafe',
    label: 'Café de barrio',
    description: 'Punto de comercio local para probar iconografía de lugares cotidianos sobre datos reales.',
    coordinates: [-70.6127, -33.4254],
  },
  {
    id: 'hospital-salvador',
    type: 'hospital',
    label: 'Hospital del Salvador',
    description: 'Equipamiento urbano importante marcado como servicio de salud en la capa jugable.',
    coordinates: [-70.5972, -33.4391],
  },
  {
    id: 'universidad-campus-oriente',
    type: 'university',
    label: 'Campus universitario',
    description: 'Referencia educacional para diferenciar puntos de interés con identidad de videojuego.',
    coordinates: [-70.5911, -33.4427],
  },
];

export const realMapPoiTypeLabels: Record<RealMapPoiType, string> = {
  metro: 'Metro',
  plaza: 'Plaza',
  cafe: 'Café',
  hospital: 'Hospital',
  university: 'Universidad',
};
