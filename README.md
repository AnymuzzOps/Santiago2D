# Santiago2D

MVP web de un mapa interactivo estilo videojuego/pixel art de Santiago de Chile.

## Stack

- React + Vite + TypeScript
- MapLibre GL JS
- CSS simple y limpio
- Vector tiles configurables mediante `VITE_TILE_URL`

## Configuración de tiles

El proyecto no incluye tiles de Google Maps, Apple Maps ni fuentes sin permiso. Para ver datos reales del mapa, crea un archivo `.env.local` con una fuente legal de vector tiles compatible con MapLibre:

```bash
VITE_TILE_URL=https://tu-proveedor-legal.example/tiles/{z}/{x}/{y}.pbf?key=TU_KEY
```

El estilo inicial está preparado para un esquema de capas tipo OpenMapTiles (`water`, `park`, `building`, `transportation`, `place`) y muestra atribución visible a OpenStreetMap.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
