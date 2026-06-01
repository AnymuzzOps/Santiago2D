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
  'diorama-focus-zone',
  'diorama-plaza-texture',
  'diorama-buildings-soft-shadow',
  'diorama-buildings-highrise-shadow',
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
  'diorama-focus-glow',
  'diorama-water-sparkles',
];

const buildingHeightExpression = [
  'interpolate',
  ['linear'],
  ['coalesce', ['to-number', ['get', 'render_height']], ['to-number', ['get', 'height']], 18],
  0,
  10,
  20,
  32,
  60,
  88,
  140,
  190,
] as unknown as PropertyValueSpecification<number>;

const buildingBaseExpression = ['coalesce', ['to-number', ['get', 'render_min_height']], ['to-number', ['get', 'min_height']], 0] as unknown as PropertyValueSpecification<number>;

const dioramaLayers: LayerSpecification[] = [
  {
    id: 'diorama-focus-zone',
    type: 'fill',
    source: DIORAMA_SOURCE_ID,
    minzoom: 14.8,
    filter: ['==', ['get', 'kind'], 'focusZone'],
    paint: {
      'fill-color': '#f7c66b',
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14.8, 0.08, 16, 0.18],
      'fill-outline-color': '#d18455',
    },
  },
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
    id: 'diorama-buildings-highrise-shadow',
    type: 'fill',
    source: 'santiago',
    'source-layer': 'building',
    minzoom: 15,
    filter: ['>=', ['coalesce', ['to-number', ['get', 'render_height']], ['to-number', ['get', 'height']], 18], 60],
    paint: {
      'fill-color': '#3d2b24',
      'fill-translate': [14, 18],
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.08, 17, 0.22],
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
        '#eeb96f',
        24,
        '#ffd58f',
        70,
        '#c8754f',
        140,
        '#704936',
      ],
      'fill-extrusion-height': buildingHeightExpression,
      'fill-extrusion-base': buildingBaseExpression,
      'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 14.8, 0.82, 16, 0.98],
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
      'fill-color': '#fff9dc',
      'fill-translate': [-1, -1],
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15.2, 0.28, 17, 0.5],
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
      'fill-color': '#fff0b8',
      'fill-translate': [-2, -2],
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 15.3, 0.3, 17, 0.55],
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
    id: 'diorama-focus-glow',
    type: 'circle',
    source: DIORAMA_SOURCE_ID,
    filter: ['==', ['get', 'kind'], 'focusGlow'],
    minzoom: 15.2,
    paint: {
      'circle-color': '#ffd36b',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15.2, 0.18, 17, 0.38],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 15.2, 8, 17, 18],
      'circle-stroke-color': '#fff2c8',
      'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 15.2, 1, 17, 2],
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
