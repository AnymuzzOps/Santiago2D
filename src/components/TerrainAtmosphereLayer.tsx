import { useEffect } from 'react';
import type { GeoJSONSourceSpecification, LayerSpecification, Map as MapLibreMap } from 'maplibre-gl';
import { terrainAtmosphereDetails } from '../data/terrainAtmosphereData';

type TerrainAtmosphereLayerProps = {
  enabled: boolean;
  map: MapLibreMap | null;
};

const TERRAIN_SOURCE_ID = 'santiago-terrain-atmosphere';
const TERRAIN_LAYER_IDS = [
  'terrain-urban-tone',
  'terrain-urban-warm-tone',
  'terrain-hill-shadow',
  'terrain-hill-mass',
  'terrain-hill-foothill',
  'terrain-water-glow',
  'terrain-park-organic-texture',
  'terrain-hill-contours',
  'terrain-canopy-shadows',
  'terrain-canopy',
  'terrain-urban-grain',
];

const terrainLayers: LayerSpecification[] = [
  {
    id: 'terrain-urban-tone',
    type: 'fill',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'urbanTone'],
    paint: {
      'fill-color': '#d7b982',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.18, 15, 0.28],
    },
  },
  {
    id: 'terrain-urban-warm-tone',
    type: 'fill',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'urbanWarmTone'],
    paint: {
      'fill-color': '#cfa877',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.12, 15, 0.22],
    },
  },
  {
    id: 'terrain-hill-shadow',
    type: 'fill',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'hillShade'],
    paint: {
      'fill-color': '#2f5f34',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.16, 15, 0.34],
      'fill-translate': [6, 8],
    },
  },
  {
    id: 'terrain-hill-mass',
    type: 'fill',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'hillMass'],
    paint: {
      'fill-color': '#4f9850',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.34, 15, 0.62],
      'fill-outline-color': '#2f6f35',
    },
  },
  {
    id: 'terrain-hill-foothill',
    type: 'fill',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'hillFoothill'],
    paint: {
      'fill-color': '#82c96a',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.12, 15, 0.32],
    },
  },
  {
    id: 'terrain-water-glow',
    type: 'fill',
    source: 'santiago',
    'source-layer': 'water',
    paint: {
      'fill-color': '#b8f3ff',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.12, 15, 0.28],
      'fill-translate': [-2, -2],
    },
  },
  {
    id: 'terrain-park-organic-texture',
    type: 'circle',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'canopy'],
    minzoom: 13.2,
    paint: {
      'circle-color': ['interpolate', ['linear'], ['zoom'], 13.2, '#5fb45b', 16, '#3f944d'],
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 13.2, 0.24, 16, 0.52],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 13.2, 8, 16, 18],
      'circle-blur': 0.35,
    },
  },
  {
    id: 'terrain-hill-contours',
    type: 'line',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'contour'],
    minzoom: 12,
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#d8f0b4',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.2, 15, 0.42],
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1.2, 16, 3],
    },
  },
  {
    id: 'terrain-canopy-shadows',
    type: 'circle',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'canopy'],
    minzoom: 15,
    paint: {
      'circle-color': '#274d2d',
      'circle-opacity': 0.26,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 5, 17, 12],
      'circle-translate': [3, 4],
    },
  },
  {
    id: 'terrain-canopy',
    type: 'circle',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'canopy'],
    minzoom: 15,
    paint: {
      'circle-color': '#3d8f43',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.64, 17, 0.9],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 3, 17, 7],
      'circle-stroke-color': '#d8f0b4',
      'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 15, 0.6, 17, 1.4],
    },
  },
  {
    id: 'terrain-urban-grain',
    type: 'circle',
    source: TERRAIN_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'urbanGrain'],
    minzoom: 15.4,
    paint: {
      'circle-color': '#fff2c8',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15.4, 0.1, 17, 0.24],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15.4, 6, 17, 12],
    },
  },
];

const removeTerrainAtmosphere = (map: MapLibreMap) => {
  [...TERRAIN_LAYER_IDS].reverse().forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  if (map.getSource(TERRAIN_SOURCE_ID)) {
    map.removeSource(TERRAIN_SOURCE_ID);
  }
};

const addLayerIfMissing = (map: MapLibreMap, layer: LayerSpecification, beforeId?: string) => {
  if (map.getLayer(layer.id)) {
    return;
  }

  map.addLayer(layer, beforeId && map.getLayer(beforeId) ? beforeId : undefined);
};

const addTerrainAtmosphere = (map: MapLibreMap) => {
  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: 'geojson',
      data: terrainAtmosphereDetails,
    } satisfies GeoJSONSourceSpecification);
  }

  terrainLayers.forEach((layer) => {
    const beforeId = layer.id === 'terrain-water-glow'
      ? 'water-soft-blue'
      : layer.id.includes('canopy') || layer.id.includes('contours') || layer.id.includes('park')
        ? 'roads-minor-outline'
        : 'buildings-long-shadow';
    addLayerIfMissing(map, layer, beforeId);
  });
};

export function TerrainAtmosphereLayer({ enabled, map }: TerrainAtmosphereLayerProps) {
  useEffect(() => {
    if (!map) {
      return undefined;
    }

    const syncLayer = () => {
      if (enabled) {
        addTerrainAtmosphere(map);
      } else {
        removeTerrainAtmosphere(map);
      }
    };

    if (map.isStyleLoaded()) {
      syncLayer();
    } else {
      map.once('load', syncLayer);
    }

    return () => {
      map.off('load', syncLayer);
      removeTerrainAtmosphere(map);
    };
  }, [enabled, map]);

  return null;
}
