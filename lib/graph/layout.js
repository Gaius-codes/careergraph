import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const defaultLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "60",
  "elk.layered.spacing.nodeNodeBetweenLayers": "160",
  "elk.edgeRouting": "SPLINES", // Smooth curved paths match smoothstep edges better
  "elk.padding": "[top=60,left=60,bottom=60,right=60]",
};

export async function layoutGraph(nodes, edges, options = {}) {
  if (!nodes.length) return nodes;

  const graph = {
    id: "career-graph",
    layoutOptions: { ...defaultLayoutOptions, ...options },
    children: nodes.map((node) => ({
      id: node.id,
      // Pass realistic dimensions reflecting CustomGraphNode styling
      width: node.measured?.width || 210,
      height: node.measured?.height || 75,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layout = await elk.layout(graph);

    const positions = new Map(
      layout.children.map((child) => [
        child.id,
        {
          x: child.x,
          y: child.y,
        },
      ])
    );

    return nodes.map((node) => ({
      ...node,
      position: positions.get(node.id) || node.position,
    }));
  } catch (err) {
    console.error("ELK Layout calculation failed:", err);
    return nodes;
  }
}