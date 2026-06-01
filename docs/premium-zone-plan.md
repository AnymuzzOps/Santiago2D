# Zona premium inicial: Providencia / Los Leones / Costanera Center

Este documento define una zona pequeña para explorar una experiencia visual premium de Santiago2D con tiles WebP pre-renderizados o assets propios, sin abandonar MapLibre como modo base y sin usar Google Earth, imágenes satelitales privadas, assets sin licencia ni tiles sin permiso.

## Objetivo de la zona premium

La zona premium busca concentrar el esfuerzo visual en un encuadre acotado y reconocible de Santiago: Providencia / Los Leones / Costanera Center. El objetivo no es cubrir toda la ciudad, sino construir una escena piloto con suficiente densidad urbana para evaluar un look tipo diorama/isométrico, con edificios volumétricos, vegetación, avenidas, detalles urbanos y sensación de ciudad explorable.

## Límites aproximados

La primera zona premium puede partir con un rectángulo pequeño alrededor del eje Los Leones / Costanera Center:

- **Norte:** borde sur del Parque Metropolitano / entorno de Av. Santa María, aproximadamente `lat -33.4105`.
- **Sur:** entorno de Av. Providencia / Nueva Providencia, aproximadamente `lat -33.4255`.
- **Oeste:** entorno de Av. Pedro de Valdivia / Suecia, aproximadamente `lng -70.6165`.
- **Este:** entorno de Tobalaba / El Bosque Norte, aproximadamente `lng -70.5950`.

Bounding box inicial sugerido:

```txt
west:  -70.6165
east:  -70.5950
north: -33.4105
south: -33.4255
```

Centro visual sugerido para pruebas:

```txt
lng: -70.6037
lat: -33.4194
```

Estos límites son aproximados y deben ajustarse después de probar composición, número de tiles, peso final y reconocimiento visual del hito Costanera Center.

## Elementos visuales necesarios

### Edificios altos

- Torres principales del entorno Costanera Center como hito visual.
- Volúmenes altos en Nueva Las Condes / El Bosque Norte / Tobalaba.
- Techos más claros, sombras laterales y contraste de fachada.
- Siluetas diferenciadas para que los edificios altos no se vean como bloques genéricos.

### Edificios residenciales y mixtos

- Bloques medianos de Providencia y Los Leones.
- Edificios residenciales con variación de altura, color y techo.
- Fachadas simplificadas pero con detalle suficiente para lectura tipo videojuego.
- Patios interiores o terrazas cuando sea viable en assets propios.

### Avenidas

- Av. Providencia / Nueva Providencia como eje principal.
- Av. Los Leones como eje vertical reconocible.
- Tobalaba / Vitacura / Andrés Bello según el recorte final.
- Diferenciar avenidas de calles secundarias con ancho, color, líneas centrales, cruces y veredas.

### Árboles y vegetación

- Árboles alineados en avenidas y veredas.
- Masa verde más fuerte hacia el norte por cercanía al Parque Metropolitano.
- Plazas y bandejones con textura propia.
- Variaciones de copa, tamaño y sombra para evitar repetición evidente.

### Plazas y espacios públicos

- Plazas pequeñas de barrio y áreas verdes cercanas.
- Superficies de pasto, senderos, mobiliario simple y sombras.
- Tratamiento visual más orgánico que una capa vectorial plana.

### Autos y vida urbana

- Autos pequeños en avenidas principales, evitando saturación.
- Vehículos estacionados en calles secundarias o estacionamientos visibles.
- Posibles buses/paraderos como props estáticos o capa `fx/ui` posterior.
- Densidad controlada para mantener rendimiento y legibilidad.

### Metro y transporte

- Referencia visual a Metro Los Leones / Tobalaba sin activar POIs automáticos masivos.
- Iconografía propia de Santiago2D para accesos de Metro.
- Paraderos como elementos pequeños en veredas principales.

### Costanera Center como hito

- Debe ser el principal punto reconocible de la zona premium.
- No usar fotografías, capturas de Google Earth ni modelos privados.
- Crear un asset/volumen estilizado propio basado en datos legales, observación general y abstracción artística.
- Mantener proporción e importancia visual sin buscar una copia hiperrealista.

## Cómo generar assets propios legalmente

### Fuentes de datos base

- **OpenStreetMap / OpenMapTiles** para huellas de edificios, calles, parques y agua, respetando licencias y atribución.
- **Datos abiertos oficiales** si existen para capas urbanas, mobiliario, áreas verdes o transporte.
- **Trabajo artístico propio** para edificios, props, techos, sombras, árboles, autos y texturas.
- **Medición/estimación procedural** para alturas cuando no exista dato confiable, marcando claramente que es estilización.

### Pipeline sugerido

1. Extraer huellas y calles de una fuente legal compatible con OSM/OpenMapTiles.
2. Normalizar la zona premium a un sistema local de coordenadas.
3. Clasificar edificios por altura estimada: bajo, medio, alto, hito.
4. Generar geometría 2.5D/isométrica propia desde huellas legales.
5. Aplicar paleta Santiago2D: techos, fachadas, sombras, vegetación y calles.
6. Agregar props propios: árboles, autos, cruces, luminarias, accesos de Metro.
7. Renderizar offline en capas WebP `scene`, `fx` y `ui`.
8. Cortar tiles `512x512` en pirámide `z/x/y`.
9. Optimizar WebP y validar seams entre tiles.
10. Servir como assets estáticos o CDN con caché.

### Reglas de licencias

- No usar Google Earth, Google Maps, Apple Maps ni imágenes satelitales sin licencia.
- No copiar capturas, tiles, modelos, texturas ni props de terceros.
- No usar tiles públicos de OSM como fuente de producción.
- Documentar atribuciones y licencias de cada fuente.
- Mantener los assets artísticos como producción propia del proyecto.

## Qué se mantiene con MapLibre

MapLibre debe seguir siendo el modo principal y la base geográfica escalable mientras la zona premium esté en exploración.

Se mantiene con MapLibre:

- Navegación general por Santiago.
- Vector tiles legales OpenMapTiles/TileJSON/XYZ.
- Estilo base cartoon/diorama actual.
- Fallback `DemoPixelMap` cuando no exista `VITE_TILE_URL`.
- POIs manuales y secretos como datos separados.
- Editor de POIs en desarrollo.
- Capas experimentales `DioramaLayer` y `TerrainAtmosphereLayer` fuera de la zona premium.

## Qué se reemplaza por tiles pre-renderizados en la zona premium

Dentro del rectángulo premium, se puede probar una capa o modo alternativo con escena pre-renderizada.

Se reemplazaría o complementaría con tiles pre-renderizados:

- Render visual detallado de edificios.
- Techos, fachadas y sombras pintadas.
- Texturas de plazas, veredas, agua y vegetación.
- Props urbanos estáticos: autos, árboles, luminarias, cruces, accesos de Metro.
- Atmósfera local: brillos, sombras suaves, grano y detalles de escena.

No deberían quedar horneados permanentemente en la imagen si necesitan interacción frecuente:

- POIs seleccionables.
- Secretos descubiertos.
- Paneles de UI.
- Estados de hover/selección.
- Elementos que deban cambiar con frecuencia.

Esos elementos conviene mantenerlos como capas `ui` o datos separados sobre el canvas, para que la experiencia siga siendo explorable y no solo una imagen estática.

## Estrategia de implementación futura

1. Mantener MapLibre como entrada principal del sitio.
2. Detectar si la cámara está dentro de la zona premium.
3. Permitir activar un modo premium experimental o hacer transición visual suave.
4. Renderizar tiles WebP propios con `RenderedTileViewer` o una versión integrada al mapa.
5. Mantener POIs, secretos e interacción como overlays de datos.
6. Medir peso, FPS, memoria y experiencia móvil antes de expandir el área.

## Criterios de éxito del piloto

- La zona se reconoce como Providencia / Los Leones / Costanera Center sin depender de labels excesivos.
- Costanera Center funciona como hito visual principal.
- La escena se siente más rica que el modo vectorial en edificios, sombras, árboles y calles.
- El peso de assets sigue siendo razonable para GitHub Pages o un hosting estático simple.
- La arquitectura no bloquea el modo MapLibre ni el fallback demo.
