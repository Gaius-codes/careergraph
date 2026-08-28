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
import { layoutGraph } from "@/lib/graph/layout";
import NodeDetails from "./NodeDetails";

// Node Type Design Map (Colors, Badges, Styles)
const NODE_TYPES_CONFIG = {
  Person: {
    label: "PERSON",
    borderColor: "#818cf8",
    border: "border-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    dot: "bg-indigo-400 border-indigo-500",
  },
  Skill: {
    label: "SKILL",
    borderColor: "#34d399",
    border: "border-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400 border-emerald-500",
  },
  Project: {
    label: "PROJECT",
    borderColor: "#fbbf24",
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400 border-amber-500",
  },
  Technology: {
    label: "TECHNOLOGY",
    borderColor: "#22d3ee",
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    dot: "bg-cyan-400 border-cyan-500",
  },
  Job: {
    label: "JOB",
    borderColor: "#fb7185",
    border: "border-rose-500",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    dot: "bg-rose-400 border-rose-500",
  },
  Company: {
    label: "COMPANY",
    borderColor: "#a78bfa",
    border: "border-violet-500",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    dot: "bg-violet-400 border-violet-500",
  },
  Industry: {
    label: "INDUSTRY",
    borderColor: "#64748b",
    border: "border-slate-500",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    dot: "bg-slate-400 border-slate-500",
  },
};

// Custom ReactFlow Node Component with dynamic colors & styles
function CustomGraphNode({ data, selected }) {
  const labelType = data.graphNode.labels?.[0] || "NODE";
  const config = NODE_TYPES_CONFIG[labelType] || {
    label: labelType,
    borderColor: "#64748b",
    border: "border-slate-600",
    bg: "bg-slate-800",
    text: "text-slate-400",
  };

  const name =
    data.graphNode.properties?.name ||
    data.graphNode.properties?.title ||
    data.graphNode.properties?.label ||
    data.graphNode.id;

  return (
    <div
      style={{
        borderRadius: "14px",
        padding: "14px 16px",
        background: "#0f172a",
        color: "#fff",
        borderColor: config.borderColor,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      }}
      className={`group relative min-w-[180px] border transition-all duration-200 ${
        selected
          ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-indigo-500/10"
          : "hover:shadow-md"
      }`}
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

// Convert DB Nodes into React Flow nodes
function convertNode(node, index = 0, total = 1) {
  const label = node.labels?.[0] || "NODE";
  const config = NODE_TYPES_CONFIG[label] || { borderColor: "#64748b" };

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
    style: {
      borderRadius: "14px",
      padding: "14px 16px",
      background: "#0f172a",
      color: "#fff",
      border: `1px solid ${config.borderColor}`,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
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

        let rawNodes = [];
        let rawEdges = [];

        setNodes((currentNodes) => {
          const existing = new Map(currentNodes.map((n) => [n.id, n]));

          incomingNodes.forEach((node, index) => {
            if (!existing.has(node.id)) {
              existing.set(
                node.id,
                convertNode(node, existing.size + index, incomingNodes.length),
              );
            }
          });

          rawNodes = replace
            ? incomingNodes.map((node, index) =>
                convertNode(node, index, incomingNodes.length),
              )
            : Array.from(existing.values());

          return rawNodes;
        });

        setEdges((currentEdges) => {
          const existing = new Map(currentEdges.map((e) => [e.id, e]));

          incomingEdges.forEach((edge) => {
            existing.set(edge.id, convertEdges([edge])[0]);
          });

          rawEdges = Array.from(existing.values());
          return rawEdges;
        });

        // Compute layout asynchronously before committing node positions
        const positionedNodes = await layoutGraph(rawNodes, rawEdges);
        setNodes(positionedNodes);

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
            {/* Legend Overlay */}
            <div className="absolute left-4 top-4 z-10 rounded-xl border border-slate-800 bg-slate-950/90 p-3 backdrop-blur shadow-lg">
              <p className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500">
                NODE TYPES
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(NODE_TYPES_CONFIG).map(([type, config]) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 text-xs text-slate-400"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${config.dot}`}
                    />
                    {type}
                  </div>
                ))}
              </div>
            </div>

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
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable
              zoomOnScroll
              zoomOnPinch
              panOnDrag
              fitView
              fitViewOptions={{ padding: 0.25 }}
              minZoom={0.2}
              maxZoom={2}
            >
              <Background color="#334155" gap={24} size={1} />
              <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 !shadow-lg rounded-xl overflow-hidden" />
              <MiniMap
                nodeColor={(n) => {
                  const label = n.data?.graphNode?.labels?.[0];
                  return NODE_TYPES_CONFIG[label]?.borderColor || "#475569";
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