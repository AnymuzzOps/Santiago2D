export type CustomPoiType = 'metro' | 'plaza' | 'cafe' | 'hospital' | 'university' | 'landmark';

export type CustomPoi = {
  id: string;
  type: CustomPoiType;
  name: string;
  description: string;
  coordinates: [number, number];
  icon: string;
  visible: boolean;
};

export const customPoiTypeLabels: Record<CustomPoiType, string> = {
  metro: 'Metro',
  plaza: 'Plaza',
  cafe: 'Café',
  hospital: 'Hospital',
  university: 'Universidad',
  landmark: 'Hito',
};

export const customPois: CustomPoi[] = [
  // Ejemplos desactivados: cambia `visible` a true cuando quieras mostrar POIs manuales.
  // {
  //   id: 'metro-los-leones',
  //   type: 'metro',
  //   name: 'Metro Los Leones',
  //   description: 'Nodo de transporte clave para recorrer Providencia como punto de viaje rápido.',
  //   coordinates: [-70.6088, -33.4222],
  //   icon: 'M',
  //   visible: false,
  // },
  // {
  //   id: 'plaza-las-lilas',
  //   type: 'plaza',
  //   name: 'Plaza Las Lilas',
  //   description: 'Área verde de barrio destacada como zona segura dentro del mapa real.',
  //   coordinates: [-70.5888, -33.4292],
  //   icon: '✦',
  //   visible: false,
  // },
  // {
  //   id: 'cafe-providencia',
  //   type: 'cafe',
  //   name: 'Café de barrio',
  //   description: 'Comercio local para probar iconografía de lugares cotidianos.',
  //   coordinates: [-70.6127, -33.4254],
  //   icon: '☕',
  //   visible: false,
  // },
];
