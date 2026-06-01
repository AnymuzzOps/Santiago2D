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
        id: 'buildings-shadow',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 14,
        paint: {
          'fill-color': '#9b785a',
          'fill-translate': [2, 2],
          'fill-opacity': 0.36,
        },
      },
      {
        id: 'buildings-simplified',
        type: 'fill',
        source: 'santiago',
        'source-layer': 'building',
        minzoom: 14,
        paint: {
          'fill-color': '#ffe0a6',
          'fill-outline-color': '#7d5d43',
        },
      },
      {
        id: 'roads-outline',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
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
            1.8,
            14,
            5,
            17,
            11,
          ],
        },
      },
      {
        id: 'roads-light',
        type: 'line',
        source: 'santiago',
        'source-layer': 'transportation',
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
            1,
            14,
            3,
            17,
            8,
          ],
        },
      },
      {
        id: 'place-labels',
        type: 'symbol',
        source: 'santiago',
        'source-layer': 'place',
        minzoom: 9,
        layout: {
          'text-field': ['coalesce', ['get', 'name:es'], ['get', 'name']],
          'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 10, 11, 15, 15],
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#5a3c2e',
          'text-halo-color': '#fff2c8',
          'text-halo-width': 2,
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
