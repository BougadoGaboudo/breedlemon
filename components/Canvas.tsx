"use client";

import { ReactNode } from "react";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";

type CanvasProps = { children: ReactNode; worldWidth: number; worldHeight: number };

export function Canvas({ children, worldWidth, worldHeight }: CanvasProps) {
  const { containerRef, transform, onPointerDown, onPointerMove, onPointerUp, zoomIn, zoomOut, reset } =
    useCanvasTransform();

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: worldWidth,
          height: worldHeight,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>

      <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 8 }}>
        <button type="button" onClick={zoomIn} className="cursor-pointer">
          +
        </button>
        <button type="button" onClick={zoomOut} className="cursor-pointer">
          −
        </button>
        <button type="button" onClick={reset} className="cursor-pointer">
          Reset
        </button>
      </div>
    </div>
  );
}
