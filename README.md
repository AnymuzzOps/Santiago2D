# Santiago2D

MVP web de un mapa interactivo estilo videojuego/pixel art de Santiago de Chile.

## Stack

- React + Vite + TypeScript
- MapLibre GL JS
- CSS simple y limpio
- Vector tiles configurables mediante `VITE_TILE_URL`

## Estado actual del MVP

Santiago2D está en una versión demo cerrada antes de conectar datos reales. La aplicación carga un shell web responsive y, si no existe `VITE_TILE_URL`, muestra una maqueta local de Providencia dibujada con HTML/CSS pixel art dentro del mismo frame del mapa.

### Qué funciona

- Modo demo local sin tiles externos ni servicios de mapas propietarios.
- Mapa visual top-down de Providencia con calles, plazas, estacionamientos, agua decorativa, árboles, luminarias, edificios y marcadores.
- Navegación básica del demo con pan mediante mouse/touch, zoom `+` / `-` y botón **Centrar Providencia**.
- Interacción con marcadores, edificios, plazas y estacionamientos para abrir un panel informativo.
- Controles y elementos clickeables implementados como botones con labels accesibles y estados `focus-visible`.
- Fallback a MapLibre cuando se configura `VITE_TILE_URL` con una fuente legal compatible.
- Build preparado para GitHub Pages con `base: "/Santiago2D/"`.

### Qué falta

- Conectar una fuente real de tiles/vector data.
- Ajustar el estilo MapLibre contra el esquema exacto del proveedor elegido.
- Reemplazar gradualmente `demoMapData` por datos reales o generados desde OpenStreetMap.
- Agregar pruebas automatizadas, validaciones visuales y una revisión completa de accesibilidad.
- Implementar features futuras como rutas, búsqueda o 3D; no forman parte de este MVP demo.

### Próximo paso

Conectar tiles legales compatibles con MapLibre. La ruta recomendada es usar un esquema tipo OpenMapTiles o un archivo/fuente PMTiles con atribución correcta de OpenStreetMap y revisar que las capas usadas en `src/map/style.ts` coincidan con el proveedor elegido.

## Configuración de tiles

El proyecto no incluye tiles de Google Maps, Apple Maps ni fuentes sin permiso. Para ver datos reales del mapa, crea un archivo `.env.local` con una fuente legal de vector tiles compatible con MapLibre:

```bash
VITE_TILE_URL=https://tu-proveedor-legal.example/tiles/{z}/{x}/{y}.pbf?key=TU_KEY
```

El estilo inicial está preparado para un esquema de capas tipo OpenMapTiles (`water`, `park`, `building`, `transportation`, `place`) y muestra atribución visible a OpenStreetMap.

Si `VITE_TILE_URL` no está configurado, la app muestra un modo demo local sin tiles externos: una maqueta pixel art de Providencia con calles, edificios, áreas verdes, agua decorativa y marcadores.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

El build usa `base: "/Santiago2D/"` para que los assets generados por Vite se publiquen correctamente bajo la ruta del repositorio en GitHub Pages.
