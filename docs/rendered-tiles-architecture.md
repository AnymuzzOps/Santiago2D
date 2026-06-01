# Fase 3 alternativa: arquitectura de tiles WebP pre-renderizados

Este documento explora una dirección visual alternativa para Santiago2D inspirada a nivel arquitectónico por experiencias de ciudad navegable con tiles pre-renderizados. La idea es estudiar el enfoque sin copiar código, assets, diseño exacto ni contenido de proyectos externos.

## MapLibre vectorial vs. tiles WebP pre-renderizados

### Modo actual: MapLibre + vector tiles

El modo principal actual usa MapLibre GL JS con una fuente legal de vector tiles compatible con OpenMapTiles. El navegador recibe geometrías vectoriales, estilos y propiedades; luego MapLibre dibuja calles, parques, agua, labels y edificios en tiempo real.

**Ventajas**

- Permite cambiar estilos rápidamente desde código.
- Funciona bien con datos geográficos reales y navegación fluida.
- Mantiene textos, capas y geometrías editables.
- Escala a zonas grandes si la fuente de tiles está bien servida.
- Es compatible con proveedores legales, OpenMapTiles, TileJSON y pipelines propios.

**Desventajas**

- El look final está limitado por la geometría disponible y por las capacidades de estilo en tiempo real.
- Conseguir un look de videojuego muy detallado puede requerir muchas capas, expresiones y datos auxiliares.
- Los edificios 2.5D dependen de atributos como `height`, `render_height` o `building`, que no siempre están completos.
- Detalles orgánicos como techos únicos, sombras pintadas, props urbanos o textura tipo diorama son difíciles de producir solo con reglas vectoriales.

### Alternativa: pirámide de tiles WebP pre-renderizados

En esta arquitectura, una zona pequeña se renderiza previamente como imágenes WebP organizadas por `z/x/y`. El navegador no interpreta edificios ni calles como geometría editable; solo dibuja imágenes de tiles ya compuestas, igual que una escena de videojuego dividida en piezas.

**Ventajas**

- Permite muchísimo más control visual: sombras pintadas, techos, textura, props, vegetación, variación de materiales y postprocesado.
- El resultado puede acercarse más a una captura de videojuego/diorama que a un mapa vectorial.
- Cada tile puede incluir composición artística compleja sin cargar miles de elementos HTML o capas MapLibre.
- Para una zona pequeña, el runtime puede ser simple: canvas, cámara propia y caché de imágenes.

**Desventajas**

- Los tiles pueden pesar mucho si hay varios zooms y capas.
- Cambiar datos implica regenerar assets.
- Labels, POIs e interacción deben manejarse en capas separadas porque la escena base es una imagen.
- Requiere pipeline de generación: datos legales, render offline, corte en tiles, optimización WebP, manifiestos y hosting.
- No conviene intentar todo Santiago al inicio; es mejor partir con Providencia / Los Leones / Costanera Center.

## Por qué permite más detalle visual

Los vector tiles se estilizan en vivo con reglas generales. En cambio, los tiles WebP pre-renderizados pueden contener una composición artística completa por tile: edificios con fachadas pintadas, sombras suaves, techos únicos, árboles con variación, autos, veredas, plazas texturizadas, iluminación ambiental y efectos de atmósfera.

Esto abre una línea visual distinta: MapLibre puede seguir siendo el modo geográfico real y escalable, mientras una escena pre-renderizada puede funcionar como experiencia premium para una zona acotada.

## Riesgos técnicos

### Peso de assets

Un tile WebP de 512x512 puede ser liviano individualmente, pero una pirámide completa crece rápido. Ejemplo: una zona de 8x8 tiles por zoom con 4 zooms y 3 capas (`scene`, `fx`, `ui`) produce 768 imágenes. Hay que limitar zona, zooms y capas.

### Hosting y caché

GitHub Pages puede servir archivos estáticos, pero hay que cuidar tamaño del repo, tiempos de deploy y caché. Para producción podría convenir un bucket/CDN con headers de caché adecuados.

### Generación de assets

El mayor trabajo está antes del navegador: obtener datos legales, generar escena, aplicar estilo, renderizar zooms, cortar tiles, comprimir WebP y validar seams entre tiles.

### Licencias

No se deben usar Google Earth, imágenes satelitales de Google, Apple Maps, tiles públicos de OSM ni assets sin licencia. La generación debe partir de datos y recursos con permisos claros.

## Propuesta técnica para Santiago2D

### Render runtime

- Canvas principal con tiles WebP `512x512`.
- Cámara propia con pan y zoom.
- Carga por plantilla `tilePathTemplate`:

```txt
/rendered-tiles/{layer}/{z}/{x}/{y}.webp
```

- Cálculo de tiles visibles según cámara y viewport.
- Caché de `HTMLImageElement` por URL.
- Placeholder procedural mientras no existan assets reales.

### Capas propuestas

1. **scene**
   - Imagen base pre-renderizada.
   - Edificios, calles, cerros, parques, agua, veredas y props estáticos.

2. **fx**
   - Efectos visuales separados.
   - Brillos de agua, sombras atmosféricas, neblina suave, luces o partículas livianas.

3. **ui**
   - Capa para overlays del runtime.
   - Retículas de debug, selección, hotspots, secretos, paneles e indicadores.

### Configuración inicial

- `tileSize`: `512`.
- `minZoom`: `14`.
- `maxZoom`: `17`.
- `initialZoom`: `15`.
- `tilePathTemplate`: `/rendered-tiles/{layer}/{z}/{x}/{y}.webp`.
- `layers`: `scene`, `fx`, `ui`.
- Zona experimental: Providencia / Los Leones / Costanera Center.

## Prototipo incluido

El prototipo mínimo agrega:

- `src/components/RenderedTileViewer.tsx`
- `src/config/renderedTilesConfig.ts`

Por defecto, MapLibre sigue siendo la experiencia principal. El viewer se puede activar para pruebas con:

```env
VITE_ENABLE_RENDERED_TILE_VIEWER=true
```

Mientras no existan tiles reales, el viewer dibuja placeholders procedurales en canvas. Esto permite validar cámara, pan, zoom, capas y composición sin copiar assets externos ni depender de imágenes sin licencia.

## Próximos pasos sugeridos

1. Definir una zona piloto pequeña alrededor de Los Leones / Costanera Center.
2. Crear un pipeline offline con datos legales.
3. Renderizar un primer set WebP para `scene` en un solo zoom.
4. Agregar `fx` después de validar peso y rendimiento.
5. Mantener POIs, secretos e interacción como datos separados sobre la escena.
