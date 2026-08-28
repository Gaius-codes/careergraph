"use client";

import Link from "next/link";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import NodeDetails from "./NodeDetails";

// Node Type Design Map (Colors, Badges, Styles)
const NODE_TYPES_CONFIG = {
  Person: {
    label: "PERSON",
    border: "border-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
  },
  Skill: {
    label: "SKILL",
    border: "border-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  Project: {
    label: "PROJECT",
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
  Technology: {
    label: "TECHNOLOGY",
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
  },
  Job: {
    label: "JOB",
    border: "border-rose-500",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
  },
  Company: {
    label: "COMPANY",
    border: "border-violet-500",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
  },
  Industry: {
    label: "INDUSTRY",
    border: "border-orange-500",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
};

// Custom ReactFlow Node Component for polished rendering
function CustomGraphNode({ data, selected }) {
  const labelType = data.graphNode.labels?.[0] || "NODE";
  const config = NODE_TYPES_CONFIG[labelType] || {
    label: labelType,
    border: "border-slate-600",
    bg: "bg-slate-800",
    text: "text-slate-400",
  };

  const name =
    data.graphNode.properties.name ||
    data.graphNode.properties.title ||
    data.graphNode.properties.label ||
    data.graphNode.id;

  return (
    <div
      className={`group relative min-w-[180px] rounded-xl border bg-slate-900/90 px-4 py-3 backdrop-blur-md transition-all duration-200 ${
        config.border
      } ${selected ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-indigo-500/10" : "hover:shadow-md"}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-600 !w-2 !h-2"
      />

      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-block rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wider ${config.bg} ${config.text}`}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-1.5 text-xs font-semibold text-slate-100 truncate">
        {name}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-600 !w-2 !h-2"
      />
    </div>
  );
}

// Convert DB Nodes into React Flow nodes with Radial Positioning
function convertNode(node, index = 0, total = 1) {
  // Radial layout placement relative to center
  const radius = index === 0 ? 0 : 220 + Math.floor(index / 8) * 90;
  const angle =
    index === 0 ? 0 : ((index - 1) / Math.max(1, total - 1)) * 2 * Math.PI;

  return {
    id: node.id,
    type: "custom",
    position: {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    },
    data: {
      graphNode: node,
    },
  };
}

// Convert DB Edges into React Flow styled edges
function convertEdges(edges) {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.relationship,
    type: "smoothstep",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#64748b",
    },
    style: { strokeWidth: 1.5, stroke: "#475569" },
    labelStyle: { fill: "#94a3b8", fontSize: 10, fontWeight: 600 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
    labelBgStyle: { fill: "#0f172a", stroke: "#334155", strokeWidth: 1 },
  }));
}

export default function GraphExplorer() {
  const nodeTypes = useMemo(() => ({ custom: CustomGraphNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const loadNode = useCallback(
    async (nodeId, replace = false) => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/graph/${nodeId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load graph");
        }

        const incomingNodes = data.connections.nodes;
        const incomingEdges = data.connections.edges;

        setNodes((currentNodes) => {
          const existing = new Map(currentNodes.map((node) => [node.id, node]));

          incomingNodes.forEach((node, index) => {
            if (!existing.has(node.id)) {
              existing.set(
                node.id,
                convertNode(node, existing.size + index, incomingNodes.length),
              );
            }
          });

          if (replace) {
            return incomingNodes.map((node, index) =>
              convertNode(node, index, incomingNodes.length),
            );
          }

          return Array.from(existing.values());
        });

        setEdges((currentEdges) => {
          const existing = new Map(currentEdges.map((edge) => [edge.id, edge]));

          incomingEdges.forEach((edge) => {
            existing.set(edge.id, convertEdges([edge])[0]);
          });

          return Array.from(existing.values());
        });

        setExpandedNodes((current) => new Set(current).add(nodeId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [setNodes, setEdges],
  );

  useEffect(() => {
    async function initialize() {
      try {
        const response = await fetch("/api/graph/person");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load career profile");
        }

        const person = data.person;
        setSelectedNode({
          id: person.id,
          labels: ["Person"],
          properties: person,
        });

        await loadNode(person.id, true);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    initialize();
  }, [loadNode]);

  const handleNodeClick = (_, flowNode) => {
    const graphNode = flowNode.data.graphNode;
    setSelectedNode(graphNode);

    if (!expandedNodes.has(graphNode.id)) {
      loadNode(graphNode.id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            {/* Navigation & Badge Row */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <svg
                  className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Dashboard</span>
              </Link>

              <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                CAREER GRAPH EXPLORER
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              Interactive Graph
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Explore skills, projects, technologies, and companies connected to
              your career path.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-400">
            <span>{nodes.length} Nodes</span>
            <span className="text-slate-600">•</span>
            <span>{edges.length} Relationships</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-900/50 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Graph & Panel Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="relative h-[calc(100vh-220px)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-xs">
            {loading && nodes.length === 0 && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
                  <p className="text-sm font-medium text-slate-400">
                    Building graph visualizer...
                  </p>
                </div>
              </div>
            )}

            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.2}
              maxZoom={2}
            >
              <Background color="#334155" gap={24} size={1} />
              <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 !shadow-lg rounded-xl overflow-hidden" />
              <MiniMap
                nodeColor={(n) => {
                  const label = n.data?.graphNode?.labels?.[0];
                  if (label === "Person") return "#6366f1";
                  if (label === "Skill") return "#10b981";
                  if (label === "Project") return "#f59e0b";
                  return "#475569";
                }}
                maskColor="rgba(15, 23, 42, 0.75)"
                className="!bg-slate-900 !border-slate-800 rounded-xl overflow-hidden"
              />
            </ReactFlow>
          </section>

          {/* Details Sidebar */}
          <NodeDetails
            node={selectedNode}
            edges={edges.map((edge) => ({
              id: edge.id,
              source: edge.source,
              target: edge.target,
              relationship: edge.label,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
