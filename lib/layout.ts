import dagre from "@dagrejs/dagre";

export function computeLayout(
  nodes: { id: string; width: number; height: number }[],
  edges: { source: string; target: string }[],
): Map<string, { x: number; y: number }> {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 5, ranksep: 100 });

  for (const n of nodes) g.setNode(n.id, { width: n.width, height: n.height });
  for (const e of edges) g.setEdge(e.source, e.target);

  dagre.layout(g);

  const positions = new Map<string, { x: number; y: number }>();
  for (const n of nodes) {
    const { x, y } = g.node(n.id);
    positions.set(n.id, { x: x - n.width / 2, y: y - n.height / 2 });
  }
  return positions;
}
