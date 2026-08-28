import { runQuery } from "./client";

export async function getNodeConnections(nodeId) {
  const query = `
    MATCH (n {id: $nodeId})-[r]-(connected)
    RETURN
      n,
      type(r) AS relationship,
      connected
    LIMIT 50
  `;

  const records = await runQuery(query, { nodeId });

  const nodes = new Map();
  const edges = [];

  for (const record of records) {
    const source = serializeNode(record.get("n"));
    const target = serializeNode(record.get("connected"));
    const relationship = record.get("relationship");

    nodes.set(source.id, source);
    nodes.set(target.id, target);

    edges.push({
      id: `${source.id}-${relationship}-${target.id}`,
      source: source.id,
      target: target.id,
      relationship,
    });
  }

  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
}

function serializeNode(node) {
  return {
    id: node.properties.id,
    labels: node.labels,
    properties: node.properties,
  };
}