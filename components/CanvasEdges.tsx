type CanvasEdgesProps = {
  edges: { id: string; source: string; target: string }[];
  nodesById: Map<string, { x: number; y: number; width: number; height: number }>;
};

export function CanvasEdges({ edges, nodesById }: CanvasEdgesProps) {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}>
      {edges.map((edge) => {
        const source = nodesById.get(edge.source);
        const target = nodesById.get(edge.target);
        if (!source || !target) return null;

        // const x1 = source.x + source.width / 2;
        // const y1 = source.y + source.height;
        // const x2 = target.x + target.width / 2;
        // const y2 = target.y;
        // const midY = (y1 + y2) / 2;

        const x1 = source.x + source.width;
        const y1 = source.y + source.height / 2;

        const x2 = target.x;
        const y2 = target.y + target.height / 2;

        const midX = (x1 + x2) / 2;

        return (
          <path
            key={edge.id}
            // d={`M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`}
            d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}
