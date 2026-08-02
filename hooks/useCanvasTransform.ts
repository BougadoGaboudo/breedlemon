"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CanvasTransform = { x: number; y: number; scale: number };

const MIN_SCALE = 0.1;
const MAX_SCALE = 2;

export function useCanvasTransform() {
  const [transform, setTransform] = useState<CanvasTransform>({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setTransform((prev) => {
        const delta = -e.deltaY * 0.001;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * (1 + delta)));

        const worldX = (cursorX - prev.x) / prev.scale;
        const worldY = (cursorY - prev.y) / prev.scale;

        return {
          scale: newScale,
          x: cursorX - worldX * newScale,
          y: cursorY - worldY * newScale,
        };
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-canvas-node]")) return;
    if (e.button !== 0) return;

    isPanning.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const zoomIn = useCallback(() => setTransform((p) => ({ ...p, scale: Math.min(MAX_SCALE, p.scale * 1.2) })), []);
  const zoomOut = useCallback(() => setTransform((p) => ({ ...p, scale: Math.max(MIN_SCALE, p.scale / 1.2) })), []);
  const reset = useCallback(() => setTransform({ x: 0, y: 0, scale: 1 }), []);

  return { containerRef, transform, onPointerDown, onPointerMove, onPointerUp, zoomIn, zoomOut, reset };
}
