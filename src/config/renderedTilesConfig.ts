type LngLatTuple = [number, number];

export type RenderedTileLayerId = 'scene' | 'fx' | 'ui';

export type RenderedTileLayerConfig = {
  id: RenderedTileLayerId;
  label: string;
  opacity: number;
};

export type RenderedTilesConfig = {
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  initialZoom: number;
  initialCenter: LngLatTuple;
  tilePathTemplate: string;
  useProceduralPlaceholders: boolean;
  layers: RenderedTileLayerConfig[];
};

export const renderedTilesConfig: RenderedTilesConfig = {
  tileSize: 512,
  minZoom: 14,
  maxZoom: 17,
  initialZoom: 15,
  initialCenter: [-70.6037, -33.4194],
  tilePathTemplate: '/rendered-tiles/{layer}/{z}/{x}/{y}.webp',
  useProceduralPlaceholders: true,
  layers: [
    { id: 'scene', label: 'Escena', opacity: 1 },
    { id: 'fx', label: 'Efectos', opacity: 0.72 },
    { id: 'ui', label: 'UI', opacity: 1 },
  ],
};
