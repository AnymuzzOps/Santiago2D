import type { SourceSpecification, StyleSpecification } from 'maplibre-gl';

// No usar tiles de Google Maps, Apple Maps ni servidores públicos de OSM en producción.
// The source-layer names below assume an OpenMapTiles-like vector tile schema.
// If a provider uses different layer names, update these source-layer values here.

export type TileSourceKind = 'xyz' | 'tilejson';

const createVectorSource = (tileUrl: string, attribution: string, sourceKind: TileSourceKind): SourceSpecification => {
  if (sourceKind === 'tilejson') {
    return {
      type: 'vector',
      url: tileUrl,
      attribution,
    };
  }

  return {
    type: 'vector',
    tiles: [tileUrl],
    minzoom: 0,
    maxzoom: 14,
    attribution,
  };
};

export function createSantiagoGameStyle(
  tileUrl: string,
  attribution: string,
  sourceKind: TileSourceKind,
): StyleSpecification {
  return {
    version: 8,
    name: 'Santiago2D Pixel Art',
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      santiago: createVectorSource(tileUrl, attribution, sourceKind),
    },
    layers: [
      {
        id: 'background-paper',
        type: 'background',
        paint: {
          'background-color': '#f8e8bd',
        },
      },
      {
        id: 'water-soft-blue',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'water',
        paint: {
          'fill-color': '#7ed7ee',
          'fill-outline-color': '#2a8ba3',
        },
      },
      {
        id: 'parks-game-green',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'park',
        paint: {
          'fill-color': '#8ed66f',
          'fill-outline-color': '#4a9d48',
        },
      },
      {
        id: 'buildings-long-shadow',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 13.5,
        paint: {
          'fill-color': '#5d3f2e',
          'fill-translate': [7, 9],
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13.5, 0.16, 16, 0.32],
        },
      },
      {
        id: 'buildings-contact-shadow',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 13.5,
        paint: {
          'fill-color': '#6f4c37',
          'fill-translate': [3, 4],
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 13.5, 0.28, 16, 0.52],
        },
      },
      {
        id: 'buildings-simplified',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 13.5,
        paint: {
          'fill-color': ['interpolate', ['linear'], ['zoom'], 13.5, '#f6c986', 16, '#ffe0a6'],
          'fill-outline-color': '#7d5d43',
        },
      },
      {
        id: 'buildings-rooftop-highlight',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 15,
        paint: {
          'fill-color': '#fff1c4',
          'fill-translate': [-1, -1],
          'fill-opacity': 0.28,
        },
      },
      {
        id: 'buildings-pixel-outline',
        type: 'line',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 14,
        layout: {
          'line-join': 'round',
        },
        paint: {
          'line-color': '#6f4c37',
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.65, 17, 0.95],
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 0.5, 17, 1.4],
        },
      },
      {
        id: 'roads-minor-outline',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
        filter: ['!in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#7d5d43',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            1.4,
            14,
            4,
            17,
            9,
          ],
        },
      },
      {
        id: 'roads-minor-light',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
        filter: ['!in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#fff4c9',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            0.8,
            14,
            2.4,
            17,
            6.8,
          ],
        },
      },
      {
        id: 'avenues-main-outline',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#5a3c2e',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            3.2,
            14,
            7.5,
            17,
            16,
          ],
        },
      },
      {
        id: 'avenues-main-light',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#ffd36b',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            1.8,
            14,
            5,
            17,
            12,
          ],
        },
      },
      {
        id: 'avenues-main-centerline',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
        minzoom: 14,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#fff2c8',
          'line-dasharray': [1.4, 1.4],
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1, 17, 2.4],
        },
      },
      {
        id: 'place-labels',
        type: 'symbol',
        source: 'santiago',
        'source-layer': 'place',
        minzoom: 11,
        filter: ['<=', ['coalesce', ['get', 'rank'], 99], 6],
        layout: {
          'text-field': ['coalesce', ['get', 'name:es'], ['get', 'name']],
          'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 15, 14],
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#5a3c2e',
          'text-halo-color': '#fff2c8',
          'text-halo-width': 2,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.25, 13, 0.7, 16, 0.9],
        },
      },
    ],
  };
}

export function createEmptyGameStyle(): StyleSpecification {
  return {
    version: 8,
    name: 'Santiago2D Empty Pixel Background',
    sources: {},
    layers: [
      {
        id: 'background-paper',
        type: 'background',
        paint: {
          'background-color': '#f8e8bd',
        },
      },
    ],
  };
}
