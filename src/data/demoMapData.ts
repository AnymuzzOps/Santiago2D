export type DemoMapElementType =
  | 'building'
  | 'tree'
  | 'lamp'
  | 'marker'
  | 'plaza'
  | 'parking'
  | 'road'
  | 'crosswalk';

export type DemoMapVariant =
  | 'large'
  | 'small'
  | 'north'
  | 'south'
  | 'horizontal'
  | 'vertical'
  | 'metro'
  | 'park'
  | 'cafe'
  | 'tower'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5';

export type DemoMapElement = {
  id: string;
  type: DemoMapElementType;
  x: string;
  y: string;
  width?: string;
  height?: string;
  label?: string;
  description?: string;
  variant?: DemoMapVariant;
};

export const demoMarkers: DemoMapElement[] = [
  { id: 'marker-metro-los-leones', type: 'marker', x: '17%', y: '67%', label: 'Metro Los Leones', description: 'Acceso rápido al eje de transporte del barrio, destacado como punto de orientación del prototipo.', variant: 'metro' },
  { id: 'marker-plaza-barrio', type: 'marker', x: '36%', y: '28%', label: 'Plaza de barrio', description: 'Área verde vecinal pensada como hito de descanso y encuentro dentro del mapa demo.', variant: 'park' },
  { id: 'marker-cafe-pocuro', type: 'marker', x: '62%', y: '58%', label: 'Café Pocuro', description: 'Pequeño comercio de esquina para probar puntos de interés con estética cartoon.', variant: 'cafe' },
  { id: 'marker-torre-providencia', type: 'marker', x: '77%', y: '35%', label: 'Torre Providencia', description: 'Referencia vertical simplificada para representar edificios reconocibles del sector.', variant: 'tower' },
];

export const demoTrees: DemoMapElement[] = [
  { id: 'tree-plaza-1', type: 'tree', x: '28%', y: '24%' },
  { id: 'tree-plaza-2', type: 'tree', x: '33%', y: '31%' },
  { id: 'tree-plaza-3', type: 'tree', x: '42%', y: '25%' },
  { id: 'tree-park-east-1', type: 'tree', x: '84%', y: '73%' },
  { id: 'tree-park-east-2', type: 'tree', x: '89%', y: '80%' },
  { id: 'tree-park-east-3', type: 'tree', x: '78%', y: '84%' },
  { id: 'tree-river-west', type: 'tree', x: '12%', y: '23%' },
  { id: 'tree-neighborhood-south', type: 'tree', x: '58%', y: '82%' },
  { id: 'tree-avenue-center', type: 'tree', x: '48%', y: '41%' },
  { id: 'tree-river-east', type: 'tree', x: '69%', y: '18%' },
  { id: 'tree-parking-south', type: 'tree', x: '23%', y: '82%' },
  { id: 'tree-street-south', type: 'tree', x: '37%', y: '76%' },
];

export const demoLamps: DemoMapElement[] = [
  { id: 'lamp-avenue-1', type: 'lamp', x: '22%', y: '50%' },
  { id: 'lamp-avenue-2', type: 'lamp', x: '46%', y: '50%' },
  { id: 'lamp-avenue-3', type: 'lamp', x: '57%', y: '50%' },
  { id: 'lamp-avenue-4', type: 'lamp', x: '68%', y: '50%' },
  { id: 'lamp-south-avenue-1', type: 'lamp', x: '22%', y: '70%' },
  { id: 'lamp-south-avenue-2', type: 'lamp', x: '46%', y: '70%' },
  { id: 'lamp-south-avenue-3', type: 'lamp', x: '57%', y: '70%' },
  { id: 'lamp-south-avenue-4', type: 'lamp', x: '68%', y: '70%' },
  { id: 'lamp-crossing-west', type: 'lamp', x: '14%', y: '38%' },
  { id: 'lamp-crossing-center', type: 'lamp', x: '49%', y: '38%' },
];

export const demoBuildings: DemoMapElement[] = Array.from({ length: 20 }, (_, index) => ({
  id: `building-block-${index + 1}`,
  type: 'building',
  x: `${(index % 5) + 1}`,
  y: `${Math.floor(index / 5) + 1}`,
  label: `Edificio ${index + 1}`,
  description: 'Bloque urbano simplificado con altura visual variable para simular densidad de Providencia.',
  variant: `${(index % 5) + 1}` as DemoMapVariant,
}));

export const demoPlazas: DemoMapElement[] = [
  { id: 'plaza-principal', type: 'plaza', x: '26%', y: '20%', width: 'min(230px, 22%)', height: '24%', label: 'Plaza principal', description: 'Plaza central del vertical slice, con senderos, fuente y árboles para reforzar la lectura top-down.', variant: 'large' },
  { id: 'plaza-bolsillo-oriente', type: 'plaza', x: '8%', y: '11%', width: 'min(190px, 18%)', height: '18%', label: 'Plaza bolsillo oriente', description: 'Área verde pequeña para probar espacios públicos secundarios dentro de la maqueta.', variant: 'small' },
];

export const demoParkings: DemoMapElement[] = [
  { id: 'parking-norte', type: 'parking', x: '18%', y: '22%', width: 'min(180px, 18%)', height: '82px', label: 'Estacionamiento norte', description: 'Zona de estacionamientos demarcados para añadir variedad urbana sin usar datos externos.', variant: 'north' },
  { id: 'parking-sur', type: 'parking', x: '8%', y: '14%', width: 'min(150px, 17%)', height: '76px', label: 'Estacionamiento sur', description: 'Bolsa de estacionamientos compacta para probar interacción en elementos de servicio.', variant: 'south' },
];

export const demoRoads: DemoMapElement[] = [
  { id: 'road-east-west-north', type: 'road', x: '-3%', y: '32%', width: '106%', height: 'clamp(34px, 5.2vw, 48px)', variant: 'horizontal' },
  { id: 'road-east-west-center', type: 'road', x: '-3%', y: '55%', width: '106%', height: 'clamp(34px, 5.2vw, 48px)', variant: 'horizontal' },
  { id: 'road-east-west-south', type: 'road', x: '-3%', y: '74%', width: '106%', height: 'clamp(34px, 5.2vw, 48px)', variant: 'horizontal' },
  { id: 'road-north-south-west', type: 'road', x: '16%', y: '-3%', width: 'clamp(34px, 5.2vw, 48px)', height: '106%', variant: 'vertical' },
  { id: 'road-north-south-center', type: 'road', x: '51%', y: '-3%', width: 'clamp(34px, 5.2vw, 48px)', height: '106%', variant: 'vertical' },
  { id: 'road-north-south-east', type: 'road', x: '71%', y: '-3%', width: 'clamp(34px, 5.2vw, 48px)', height: '106%', variant: 'vertical' },
];

export const demoCrosswalks: DemoMapElement[] = [
  { id: 'crosswalk-west-center', type: 'crosswalk', x: 'calc(16% - 2px)', y: 'calc(55% + 11px)', width: '46px', height: '24px' },
  { id: 'crosswalk-center-north', type: 'crosswalk', x: 'calc(51% - 2px)', y: 'calc(32% + 11px)', width: '46px', height: '24px' },
  { id: 'crosswalk-east-south', type: 'crosswalk', x: 'calc(71% - 2px)', y: 'calc(74% + 11px)', width: '46px', height: '24px' },
  { id: 'crosswalk-center-south', type: 'crosswalk', x: 'calc(51% - 2px)', y: 'calc(74% + 11px)', width: '46px', height: '24px' },
];
