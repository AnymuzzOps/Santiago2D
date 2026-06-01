import { useEffect } from 'react';
import type { LngLatLike, Map as MapLibreMap, Marker as MapLibreMarker, MarkerOptions } from 'maplibre-gl';
import type { CustomPoi } from '../data/customPois';

export type MapPoiMarkerConstructor = new (options?: MarkerOptions) => MapLibreMarker;

type MapPoiMarkerProps = {
  map: MapLibreMap | null;
  markerConstructor: MapPoiMarkerConstructor | null;
  pois: CustomPoi[];
  selectedPoiId?: string;
  onSelect: (poi: CustomPoi) => void;
};

export function MapPoiMarker({
  map,
  markerConstructor: MarkerConstructor,
  pois,
  selectedPoiId,
  onSelect,
}: MapPoiMarkerProps) {
  useEffect(() => {
    if (!map || !MarkerConstructor || pois.length === 0) {
      return undefined;
    }

    const markers = pois.map((poi) => {
      const markerButton = document.createElement('button');
      markerButton.type = 'button';
      markerButton.className = `real-poi-marker real-poi-marker--${poi.type}`;
      markerButton.setAttribute('aria-label', `Ver información de ${poi.name}`);
      markerButton.setAttribute('aria-pressed', 'false');
      markerButton.dataset.poiId = poi.id;

      const icon = document.createElement('span');
      icon.className = 'real-poi-marker__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = poi.icon;

      const label = document.createElement('span');
      label.className = 'real-poi-marker__label';
      label.textContent = poi.name;

      markerButton.append(icon, label);
      markerButton.addEventListener('click', (event) => {
        event.stopPropagation();
        onSelect(poi);
      });

      const marker = new MarkerConstructor({
        element: markerButton,
        anchor: 'bottom',
      })
        .setLngLat(poi.coordinates as LngLatLike)
        .addTo(map);

      return { marker, element: markerButton, poiId: poi.id };
    });

    return () => {
      markers.forEach(({ marker }) => marker.remove());
    };
  }, [map, MarkerConstructor, pois, onSelect]);

  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('.real-poi-marker[data-poi-id]').forEach((element) => {
      const isSelected = selectedPoiId === element.dataset.poiId;
      element.classList.toggle('real-poi-marker--selected', isSelected);
      element.setAttribute('aria-pressed', String(isSelected));
    });
  }, [selectedPoiId]);

  return null;
}
