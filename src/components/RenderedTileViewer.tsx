import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { renderedTilesConfig, type RenderedTileLayerId } from '../config/renderedTilesConfig';

type CameraState = {
  centerX: number;
  centerY: number;
  zoom: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  cameraX: number;
  cameraY: number;
};

const worldSizeForZoom = (zoom: number) => renderedTilesConfig.tileSize * 2 ** zoom;

const lngLatToWorld = ([lng, lat]: [number, number], zoom: number) => {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const worldSize = worldSizeForZoom(zoom);

  return {
    x: ((lng + 180) / 360) * worldSize,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * worldSize,
  };
};

const getInitialCamera = (): CameraState => {
  const center = lngLatToWorld(renderedTilesConfig.initialCenter, renderedTilesConfig.initialZoom);

  return {
    centerX: center.x,
    centerY: center.y,
    zoom: renderedTilesConfig.initialZoom,
  };
};

const clampZoom = (zoom: number) =>
  Math.min(renderedTilesConfig.maxZoom, Math.max(renderedTilesConfig.minZoom, zoom));

const buildTileUrl = (layer: RenderedTileLayerId, z: number, x: number, y: number) =>
  renderedTilesConfig.tilePathTemplate
    .replace('{layer}', layer)
    .replace('{z}', String(z))
    .replace('{x}', String(x))
    .replace('{y}', String(y));

const tileHash = (z: number, x: number, y: number) => {
  let hash = z * 73856093 ^ x * 19349663 ^ y * 83492791;
  hash = (hash << 13) ^ hash;
  return Math.abs((hash * (hash * hash * 15731 + 789221) + 1376312589) & 0x7fffffff);
};

const drawPixelTree = (context: CanvasRenderingContext2D, x: number, y: number, scale = 1) => {
  context.fillStyle = '#3f7f3c';
  context.fillRect(x, y, 8 * scale, 8 * scale);
  context.fillStyle = '#5fa24f';
  context.fillRect(x + 2 * scale, y - 2 * scale, 8 * scale, 8 * scale);
  context.fillStyle = '#2f5c30';
  context.fillRect(x + 5 * scale, y + 8 * scale, 2 * scale, 5 * scale);
};

const drawProceduralSceneTile = (
  context: CanvasRenderingContext2D,
  z: number,
  x: number,
  y: number,
  tileSize: number,
) => {
  const hash = tileHash(z, x, y);
  const hueShift = hash % 18;

  context.fillStyle = `rgb(${207 + hueShift}, ${202 + Math.floor(hueShift / 2)}, ${180 - Math.floor(hueShift / 3)})`;
  context.fillRect(0, 0, tileSize, tileSize);

  context.strokeStyle = 'rgba(95, 91, 78, 0.12)';
  context.lineWidth = 1;
  for (let grid = 0; grid <= tileSize; grid += 32) {
    context.beginPath();
    context.moveTo(grid, 0);
    context.lineTo(grid, tileSize);
    context.stroke();
    context.beginPath();
    context.moveTo(0, grid);
    context.lineTo(tileSize, grid);
    context.stroke();
  }

  const roadOffset = hash % 96;
  context.strokeStyle = '#d7d0bf';
  context.lineWidth = 34;
  context.beginPath();
  context.moveTo(-20, 120 + roadOffset);
  context.lineTo(tileSize + 20, 104 + roadOffset);
  context.stroke();

  context.strokeStyle = '#b9a98d';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(-20, 120 + roadOffset);
  context.lineTo(tileSize + 20, 104 + roadOffset);
  context.stroke();

  context.strokeStyle = '#efe6ca';
  context.lineWidth = 28;
  context.beginPath();
  context.moveTo(118 + (hash % 64), -20);
  context.lineTo(136 + (hash % 64), tileSize + 20);
  context.stroke();

  context.fillStyle = '#77a75f';
  context.fillRect(32 + (hash % 42), 304, 150, 116);
  context.fillStyle = 'rgba(46, 94, 48, 0.2)';
  for (let i = 0; i < 14; i += 1) {
    drawPixelTree(context, 46 + ((i * 29 + hash) % 124), 320 + ((i * 17 + hash) % 78), 1);
  }

  for (let i = 0; i < 10; i += 1) {
    const buildingX = 210 + ((i * 71 + hash) % 260);
    const buildingY = 44 + ((i * 47 + hash) % 360);
    const buildingWidth = 36 + ((hash + i * 11) % 54);
    const buildingHeight = 34 + ((hash + i * 19) % 82);
    const isTall = buildingHeight > 78;

    context.fillStyle = 'rgba(55, 48, 42, 0.24)';
    context.fillRect(buildingX + 10, buildingY + 12, buildingWidth, buildingHeight);
    context.fillStyle = isTall ? '#8f908f' : '#b8a994';
    context.fillRect(buildingX, buildingY, buildingWidth, buildingHeight);
    context.strokeStyle = '#5e574d';
    context.lineWidth = 3;
    context.strokeRect(buildingX, buildingY, buildingWidth, buildingHeight);
    context.fillStyle = isTall ? '#d6d8d1' : '#d9c9ae';
    context.fillRect(buildingX + 5, buildingY + 5, buildingWidth - 10, 10);
  }

  context.fillStyle = '#71a9c5';
  context.beginPath();
  context.ellipse(tileSize - 86, tileSize - 72, 98, 24, -0.25, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = 'rgba(235, 251, 255, 0.5)';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(tileSize - 164, tileSize - 78);
  context.lineTo(tileSize - 24, tileSize - 52);
  context.stroke();
};

const drawProceduralFxTile = (context: CanvasRenderingContext2D, z: number, x: number, y: number, tileSize: number) => {
  const hash = tileHash(z, x, y);
  const gradient = context.createRadialGradient(256, 220, 20, 256, 220, 360);
  gradient.addColorStop(0, 'rgba(255, 236, 178, 0.16)');
  gradient.addColorStop(0.55, 'rgba(112, 148, 115, 0.06)');
  gradient.addColorStop(1, 'rgba(33, 45, 58, 0.12)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, tileSize, tileSize);

  context.fillStyle = 'rgba(255, 255, 255, 0.16)';
  for (let i = 0; i < 18; i += 1) {
    context.fillRect((hash + i * 83) % tileSize, (hash + i * 47) % tileSize, 2, 2);
  }
};

const drawProceduralUiTile = (context: CanvasRenderingContext2D, z: number, x: number, y: number, tileSize: number) => {
  context.strokeStyle = 'rgba(44, 38, 32, 0.28)';
  context.lineWidth = 2;
  context.strokeRect(1, 1, tileSize - 2, tileSize - 2);
  context.fillStyle = 'rgba(29, 25, 22, 0.58)';
  context.font = '18px monospace';
  context.fillText(`z${z} / ${x} / ${y}`, 18, 34);
};

const drawProceduralTile = (
  context: CanvasRenderingContext2D,
  layer: RenderedTileLayerId,
  z: number,
  x: number,
  y: number,
  tileSize: number,
) => {
  if (layer === 'scene') {
    drawProceduralSceneTile(context, z, x, y, tileSize);
  }

  if (layer === 'fx') {
    drawProceduralFxTile(context, z, x, y, tileSize);
  }

  if (layer === 'ui') {
    drawProceduralUiTile(context, z, x, y, tileSize);
  }
};

export function RenderedTileViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const uiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 960, height: 540 });
  const [camera, setCamera] = useState<CameraState>(() => getInitialCamera());

  const canvasByLayer = useMemo(
    () => ({
      scene: sceneCanvasRef,
      fx: fxCanvasRef,
      ui: uiCanvasRef,
    }),
    [],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setViewportSize({
        width: Math.max(320, Math.round(width)),
        height: Math.max(280, Math.round(height)),
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const tileSize = renderedTilesConfig.tileSize;
    const z = Math.round(camera.zoom);
    const viewportLeft = camera.centerX - viewportSize.width / 2;
    const viewportTop = camera.centerY - viewportSize.height / 2;
    const startTileX = Math.floor(viewportLeft / tileSize) - 1;
    const endTileX = Math.floor((viewportLeft + viewportSize.width) / tileSize) + 1;
    const startTileY = Math.floor(viewportTop / tileSize) - 1;
    const endTileY = Math.floor((viewportTop + viewportSize.height) / tileSize) + 1;
    const scale = 2 ** (camera.zoom - z);

    renderedTilesConfig.layers.forEach((layer) => {
      const canvas = canvasByLayer[layer.id].current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context) {
        return;
      }

      canvas.width = Math.round(viewportSize.width * devicePixelRatio);
      canvas.height = Math.round(viewportSize.height * devicePixelRatio);
      canvas.style.width = `${viewportSize.width}px`;
      canvas.style.height = `${viewportSize.height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.clearRect(0, 0, viewportSize.width, viewportSize.height);
      context.globalAlpha = layer.opacity;
      context.imageSmoothingEnabled = true;

      for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
        for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
          const screenX = (tileX * tileSize - viewportLeft) * scale;
          const screenY = (tileY * tileSize - viewportTop) * scale;
          const scaledTileSize = tileSize * scale;

          context.save();
          context.translate(screenX, screenY);
          context.scale(scale, scale);
          drawProceduralTile(context, layer.id, z, tileX, tileY, tileSize);
          context.restore();

          if (!renderedTilesConfig.useProceduralPlaceholders) {
            buildTileUrl(layer.id, z, tileX, tileY);
          }

          context.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          context.strokeRect(screenX, screenY, scaledTileSize, scaledTileSize);
        }
      }

      context.globalAlpha = 1;
    });
  }, [camera, canvasByLayer, viewportSize]);

  const updateZoom = useCallback((direction: 1 | -1) => {
    setCamera((currentCamera) => {
      const nextZoom = clampZoom(currentCamera.zoom + direction);
      const zoomRatio = 2 ** (nextZoom - currentCamera.zoom);

      return {
        centerX: currentCamera.centerX * zoomRatio,
        centerY: currentCamera.centerY * zoomRatio,
        zoom: nextZoom,
      };
    });
  }, []);

  const resetCamera = useCallback(() => {
    setCamera(getInitialCamera());
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      cameraX: camera.centerX,
      cameraY: camera.centerY,
    };
  }, [camera]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    setCamera((currentCamera) => ({
      ...currentCamera,
      centerX: dragState.cameraX - (event.clientX - dragState.startX),
      centerY: dragState.cameraY - (event.clientY - dragState.startY),
    }));
  }, []);

  const stopDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
    }
  }, []);

  return (
    <section className="rendered-tile-card" aria-labelledby="rendered-tile-title">
      <div className="rendered-tile-card__header">
        <div>
          <p className="eyebrow">Fase 3 experimental</p>
          <h2 id="rendered-tile-title">Tile viewer pre-renderizado</h2>
          <p>
            Prototipo canvas para validar una pirámide WebP z/x/y sin reemplazar el modo principal MapLibre.
          </p>
        </div>
        <div className="rendered-tile-card__meta" aria-label="Configuración del prototipo">
          <span>512 WebP</span>
          <span>scene / fx / ui</span>
          <span>z{renderedTilesConfig.minZoom}–z{renderedTilesConfig.maxZoom}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="rendered-tile-viewer"
        role="application"
        aria-label="Prototipo de cámara propia para tiles pre-renderizados"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <canvas ref={sceneCanvasRef} className="rendered-tile-viewer__canvas" aria-hidden="true" />
        <canvas ref={fxCanvasRef} className="rendered-tile-viewer__canvas" aria-hidden="true" />
        <canvas ref={uiCanvasRef} className="rendered-tile-viewer__canvas" aria-hidden="true" />

        <div className="rendered-tile-viewer__hud" aria-live="polite">
          <strong>Placeholder procedural</strong>
          <span>z{camera.zoom.toFixed(0)} · tiles 512px · {renderedTilesConfig.tilePathTemplate}</span>
        </div>

        <div className="rendered-tile-viewer__controls" aria-label="Controles del tile viewer">
          <button type="button" onClick={() => updateZoom(1)} aria-label="Acercar prototipo de tiles">
            +
          </button>
          <button type="button" onClick={() => updateZoom(-1)} aria-label="Alejar prototipo de tiles">
            −
          </button>
          <button type="button" onClick={resetCamera} aria-label="Recentrar prototipo en Providencia">
            Centrar
          </button>
        </div>
      </div>
    </section>
  );
}
