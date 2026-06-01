import { useEffect } from 'react';
import type { GeoJSONSourceSpecification, LayerSpecification, Map as MapLibreMap, PropertyValueSpecification } from 'maplibre-gl';
import { mapConfig } from '../config/mapConfig';
import { dioramaDetails } from '../data/dioramaDetails';

type DioramaLayerProps = {
  enabled: boolean;
  map: MapLibreMap | null;
};

const DIORAMA_SOURCE_ID = 'santiago-diorama-details';
const DIORAMA_LAYER_IDS = [
  'diorama-plaza-texture',
  'diorama-buildings-soft-shadow',
  'diorama-buildings-volume',
  'diorama-buildings-rooftop-highlight',
  'diorama-buildings-highrise-crowns',
  'diorama-buildings-cartoon-outline',
  'diorama-avenue-glow',
  'diorama-crosswalks',
  'diorama-plaza-details',
  'diorama-tree-shadows',
  'diorama-trees',
  'diorama-car-shadows',
  'diorama-cars',
  'diorama-transit-halos',
  'diorama-transit-labels',
  'diorama-water-sparkles',
];

const buildingHeightExpression = [
  'interpolate',
  ['linear'],
  ['coalesce', ['to-number', ['get', 'render_height']], ['to-number', ['get', 'height']], 18],
  0,
  10,
  20,
  26,
  60,
  72,
  140,
  150,
] as unknown as PropertyValueSpecification<number>;

const buildingBaseExpression = ['coalesce', ['to-number', ['get', 'render_min_height']], ['to-number', ['get', 'min_height']], 0] as unknown as PropertyValueSpecification<number>;

const dioramaLayers: LayerSpecification[] = [
  {
    id: 'diorama-plaza-texture',
    type: 'fill',
    source: DIORAMA_SOURCE_ID,
    minzoom: 15,
    filter: ['==', ['get', 'kind'], 'plazaTexture'],
    paint: {
      'fill-color': '#78c75c',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.28, 16, 0.58],
      'fill-outline-color': '#4a9d48',
    },
  },
  {
    id: 'diorama-buildings-soft-shadow',
    type: 'fill',
    source: 'santiago',
    'source-layer': 'building',
    minzoom: 14.8,
    paint: {
      'fill-color': '#4f3528',
      'fill-translate': [10, 12],
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14.8, 0.08, 16, 0.24],
    },
  },
  {
    id: 'diorama-buildings-volume',
    type: 'fill-extrusion',
    source: 'santiago',
    'source-layer': 'building',
    minzoom: 14.8,
    paint: {
      'fill-extrusion-color': [
        'interpolate',
        ['linear'],
        ['coalesce', ['to-number', ['get', 'render_height']], ['to-number', ['get', 'height']], 18],
        0,
        '#f6c27a',
        24,
        '#ffdca0',
        70,
        '#d18455',
        140,
        '#8f5f44',
      ],
      'fill-extrusion-height': buildingHeightExpression,
      'fill-extrusion-base': buildingBaseExpression,
      'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 14.8, 0.78, 16, 0.96],
      'fill-extrusion-vertical-gradient': true,
    },
  },
  {
    id: 'diorama-buildings-rooftop-highlight',
    type: 'fill',
    source: 'santiago',
    'source-layer': 'building',
    minzoom: 15.2,
    paint: {
      'fill-color': '#fff7d8',
      'fill-translate': [-1, -1],
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15.2, 0.22, 17, 0.42],
    },
  },
  {
    id: 'diorama-buildings-highrise-crowns',
    type: 'fill',
    source: 'santiago',
    'source-layer': 'building',
    minzoom: 15.3,
    filter: ['>=', ['coalesce', ['to-number', ['get', 'render_height']], ['to-number', ['get', 'height']], 18], 60],
    paint: {
      'fill-color': '#ffe8a8',
      'fill-translate': [-2, -2],
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15.3, 0.18, 17, 0.36],
    },
  },
  {
    id: 'diorama-buildings-cartoon-outline',
    type: 'line',
    source: 'santiago',
    'source-layer': 'building',
    minzoom: 15,
    layout: {
      'line-join': 'round',
    },
    paint: {
      'line-color': '#5a3c2e',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.62, 17, 0.96],
      'line-width': ['interpolate', ['linear'], ['zoom'], 15, 0.75, 17, 1.9],
    },
  },
  {
    id: 'diorama-avenue-glow',
    type: 'line',
    source: 'santiago',
    'source-layer': 'transportation',
    filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
    minzoom: 14.5,
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#ffea91',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 14.5, 0.18, 16, 0.44],
      'line-width': ['interpolate', ['linear'], ['zoom'], 14.5, 8, 17, 20],
    },
  },
  {
    id: 'diorama-crosswalks',
    type: 'line',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'crosswalk'],
    minzoom: 15.6,
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#fff8df',
      'line-dasharray': [0.22, 0.22],
      'line-opacity': 0.92,
      'line-width': ['interpolate', ['linear'], ['zoom'], 15.6, 4, 17, 8],
    },
  },
  {
    id: 'diorama-plaza-details',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'plazaDetail'],
    minzoom: 15.4,
    paint: {
      'circle-color': '#e7ffd0',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15.4, 0.28, 17, 0.68],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15.4, 2, 17, 4.5],
      'circle-stroke-color': '#4a9d48',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'diorama-tree-shadows',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'tree'],
    minzoom: 15,
    paint: {
      'circle-color': '#4f3528',
      'circle-opacity': 0.28,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 5, 17, 11],
      'circle-translate': [3, 4],
    },
  },
  {
    id: 'diorama-trees',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'tree'],
    minzoom: 15,
    paint: {
      'circle-color': '#4a9d48',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.78, 16, 1],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 5, 17, 10],
      'circle-stroke-color': '#245f2f',
      'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 15, 1.4, 17, 3],
    },
  },
  {
    id: 'diorama-car-shadows',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'car'],
    minzoom: 15.8,
    paint: {
      'circle-color': '#4f3528',
      'circle-opacity': 0.24,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15.8, 3, 17, 5.5],
      'circle-translate': [2, 3],
    },
  },
  {
    id: 'diorama-cars',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'car'],
    minzoom: 15.8,
    paint: {
      'circle-color': ['match', ['get', 'color'], 'red', '#e54545', 'blue', '#2a8ba3', 'yellow', '#ffd36b', 'white', '#fff8df', '#ffb06c'],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15.8, 2.6, 17, 4.8],
      'circle-stroke-color': '#3d2b24',
      'circle-stroke-width': 1.2,
    },
  },
  {
    id: 'diorama-transit-halos',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'transit'],
    minzoom: 14.5,
    paint: {
      'circle-color': ['match', ['get', 'transitType'], 'metro', '#e54545', 'bus', '#2a8ba3', '#fff2c8'],
      'circle-opacity': 0.94,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 14.5, 9, 17, 15],
      'circle-stroke-color': '#3d2b24',
      'circle-stroke-width': 2.5,
    },
  },
  {
    id: 'diorama-transit-labels',
    type: 'symbol',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'transit'],
    minzoom: 14.5,
    layout: {
      'text-field': ['get', 'label'],
      'text-font': ['Noto Sans Bold', 'Noto Sans Regular'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 14.5, 9, 17, 12],
      'text-anchor': 'center',
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#fff8df',
      'text-halo-color': '#3d2b24',
      'text-halo-width': 1.2,
    },
  },
  {
    id: 'diorama-water-sparkles',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'waterSparkle'],
    minzoom: 15,
    paint: {
      'circle-color': '#e3fbff',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.38, 17, 0.78],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15, 2, 17, 5],
      'circle-stroke-color': '#7ed7ee',
      'circle-stroke-width': 1,
    },
  },
];

const addLayerIfMissing = (map: MapLibreMap, layer: LayerSpecification, beforeId?: string) => {
  if (map.getLayer(layer.id)) {
    return;
  }

  map.addLayer(layer, beforeId && map.getLayer(beforeId) ? beforeId : undefined);
};

const removeDioramaLayer = (map: MapLibreMap) => {
  [...DIORAMA_LAYER_IDS].reverse().forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  if (map.getSource(DIORAMA_SOURCE_ID)) {
    map.removeSource(DIORAMA_SOURCE_ID);
  }
};

const addDioramaLayer = (map: MapLibreMap) => {
  if (!map.getSource(DIORAMA_SOURCE_ID)) {
    map.addSource(DIORAMA_SOURCE_ID, {
      type: 'geojson',
      data: dioramaDetails,
    } satisfies GeoJSONSourceSpecification);
  }

  dioramaLayers.forEach((layer) => {
    const beforeId = layer.id.includes('buildings') || layer.id.includes('plaza')
      ? 'roads-minor-outline'
      : layer.id === 'diorama-avenue-glow'
        ? 'avenues-main-light'
        : 'place-labels';
    addLayerIfMissing(map, layer, beforeId);
  });
};

export function DioramaLayer({ enabled, map }: DioramaLayerProps) {
  useEffect(() => {
    if (!map) {
      return undefined;
    }

    const syncLayer = () => {
      if (enabled) {
        addDioramaLayer(map);
      } else {
        removeDioramaLayer(map);
      }
    };

    if (map.isStyleLoaded()) {
      syncLayer();
    } else {
      map.once('load', syncLayer);
    }

    return () => {
      map.off('load', syncLayer);
      removeDioramaLayer(map);
    };
  }, [enabled, map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.easeTo({
      bearing: enabled ? mapConfig.dioramaBearing : 0,
      duration: 700,
      pitch: enabled ? mapConfig.dioramaPitch : 0,
    });
  }, [enabled, map]);

  return null;
}
