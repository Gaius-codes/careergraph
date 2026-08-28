import React from "react";

const NODE_TYPES_CONFIG = {
  Person: { label: "PERSON", bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400" },
  Skill: { label: "SKILL", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  Project: { label: "PROJECT", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  Technology: { label: "TECHNOLOGY", bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  Job: { label: "JOB", bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
  Company: { label: "COMPANY", bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
  Industry: { label: "INDUSTRY", bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
};

function formatKeyLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
}

export default function NodeDetails({ node, edges = [] }) {
  if (!node) {
    return (
      <aside className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-800/50 text-slate-500">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-300">No Node Selected</h3>
        <p className="mt-1 text-xs text-slate-500">
          Click on any node in the graph to inspect its properties and relationships.
        </p>
      </aside>
    );
  }

  const labelType = node.labels?.[0] || "Node";
  const badgeConfig = NODE_TYPES_CONFIG[labelType] || {
    label: labelType.toUpperCase(),
    bg: "bg-slate-800",
    border: "border-slate-700",
    text: "text-slate-400",
  };

  const nodeTitle =
    node.properties?.name ||
    node.properties?.title ||
    node.properties?.label ||
    node.id;

  const relationships = edges.filter(
    (edge) => edge.source === node.id || edge.target === node.id
  );

  const ignoredKeys = new Set(["id", "name", "title", "label"]);
  const properties = Object.entries(node.properties || {}).filter(
    ([key]) => !ignoredKeys.has(key)
  );

  return (
    <aside className="flex flex-col h-[calc(100vh-220px)] min-h-[600px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xs shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800/80 p-5 bg-slate-900/80">
        <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider ${badgeConfig.bg} ${badgeConfig.border} ${badgeConfig.text}`}>
          {badgeConfig.label}
        </span>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-white truncate" title={nodeTitle}>
          {nodeTitle}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 font-mono truncate">ID: {node.id}</p>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Properties Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Properties
          </h3>

          {properties.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No additional attributes recorded.</p>
          ) : (
            <div className="space-y-2">
              {properties.map(([key, value]) => (
                <div key={key} className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 transition-colors hover:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {formatKeyLabel(key)}
                  </p>
                  <p className="mt-1 text-xs text-slate-200 break-words font-medium">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Relationships Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Relationships
            </h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
              {relationships.length}
            </span>
          </div>

          <div className="space-y-2">
            {relationships.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No connected nodes found.</p>
            ) : (
              relationships.map((edge) => {
                const isOutgoing = edge.source === node.id;
                const connectedTarget = isOutgoing ? edge.target : edge.source;

                return (
                  <div
                    key={edge.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-800/30 p-3 transition-all hover:bg-slate-800/60 hover:border-slate-700"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isOutgoing ? "text-indigo-400" : "text-emerald-400"}`}>
                          {isOutgoing ? "→" : "←"}
                        </span>
                        <span className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                          {edge.relationship}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-200 truncate" title={connectedTarget}>
                        {connectedTarget}
                      </p>
                    </div>

                    <span className="ml-2 text-[10px] font-medium text-slate-500 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-md">
                      {isOutgoing ? "Outgoing" : "Incoming"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}