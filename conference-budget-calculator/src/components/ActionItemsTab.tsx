"use client";

import { useState } from "react";
import type { Conference, ActionItem, ActionItemStatus } from "@/lib/types";
import { genId } from "@/lib/defaults";
import ProgressBar from "./ProgressBar";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

const STATUS_COLORS: Record<ActionItemStatus, string> = {
  not_started: "#F44336",
  in_progress: "#FFC107",
  completed: "#4CAF50",
};

export default function ActionItemsTab({ conference: conf, update }: Props) {
  const [filterStatus, setFilterStatus] = useState<ActionItemStatus | "all">("all");
  const [filterDri, setFilterDri] = useState("");
  const [newPhaseName, setNewPhaseName] = useState("");
  const [showNewPhase, setShowNewPhase] = useState(false);

  const allDris = Array.from(
    new Set(
      Object.values(conf.actionItems)
        .flat()
        .map((i) => i.dri)
        .filter(Boolean)
    )
  ).sort();

  function updateItems(newItems: Record<string, ActionItem[]>) {
    update({ actionItems: newItems });
  }

  function updateItem(phase: string, id: string, field: keyof ActionItem, value: string) {
    const newItems = { ...conf.actionItems };
    newItems[phase] = newItems[phase].map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateItems(newItems);
  }

  function addItem(phase: string) {
    const newItems = { ...conf.actionItems };
    newItems[phase] = [
      ...newItems[phase],
      { id: genId("ai"), status: "not_started" as ActionItemStatus, dueDate: "", dri: "", task: "", notes: "", estimatedTime: "" },
    ];
    updateItems(newItems);
  }

  function removeItem(phase: string, id: string) {
    const newItems = { ...conf.actionItems };
    newItems[phase] = newItems[phase].filter((item) => item.id !== id);
    updateItems(newItems);
  }

  function addPhase() {
    if (!newPhaseName.trim()) return;
    const newItems = { ...conf.actionItems, [newPhaseName.trim()]: [] };
    updateItems(newItems);
    setNewPhaseName("");
    setShowNewPhase(false);
  }

  function removePhase(phase: string) {
    if (!confirm(`Delete phase "${phase}" and all its items?`)) return;
    const newItems = { ...conf.actionItems };
    delete newItems[phase];
    updateItems(newItems);
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div
        className="p-4 flex items-center gap-4 flex-wrap"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--color-gray)" }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ActionItemStatus | "all")}
            className="text-xs px-2 py-1 focus:outline-none cursor-pointer"
            style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
          >
            <option value="all">All</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--color-gray)" }}>DRI:</span>
          <select
            value={filterDri}
            onChange={(e) => setFilterDri(e.target.value)}
            className="text-xs px-2 py-1 focus:outline-none cursor-pointer"
            style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
          >
            <option value="">All</option>
            {allDris.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setShowNewPhase(true)}
            className="text-xs font-medium px-3 py-1.5"
            style={{ color: "var(--color-applied-blue)", border: "1px solid var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
          >
            + Add Phase
          </button>
        </div>
      </div>

      {showNewPhase && (
        <div
          className="p-4 flex items-center gap-3"
          style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
        >
          <input
            autoFocus
            type="text"
            value={newPhaseName}
            onChange={(e) => setNewPhaseName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPhase()}
            placeholder="Phase name"
            className="flex-1 text-sm px-3 py-1.5 focus:outline-none"
            style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
          />
          <button onClick={addPhase} className="text-xs px-3 py-1.5 text-white" style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}>
            Add
          </button>
          <button onClick={() => { setShowNewPhase(false); setNewPhaseName(""); }} className="text-xs px-2 py-1.5" style={{ color: "var(--color-gray)" }}>
            Cancel
          </button>
        </div>
      )}

      {/* Phases */}
      {Object.entries(conf.actionItems).map(([phase, items]) => {
        const filtered = items.filter((item) => {
          if (filterStatus !== "all" && item.status !== filterStatus) return false;
          if (filterDri && item.dri !== filterDri) return false;
          return true;
        });
        const done = items.filter((i) => i.status === "completed").length;

        return (
          <div
            key={phase}
            style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}
          >
            {/* Phase header */}
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate" style={{ color: "var(--color-off-black)" }}>{phase}</h3>
                <span className="text-xs tabular-nums whitespace-nowrap" style={{ color: "var(--color-gray)" }}>
                  {done}/{items.length} complete
                </span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-24">
                  <ProgressBar completed={done} total={items.length} showLabel={false} />
                </div>
                <button
                  onClick={() => removePhase(phase)}
                  className="text-xs ml-2"
                  style={{ color: "var(--color-light-gray)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Column headers */}
            <div
              className="px-5 py-2 grid gap-2 text-xs font-medium uppercase"
              style={{
                color: "var(--color-gray)",
                letterSpacing: "0.06em",
                borderBottom: "1px solid var(--color-light-gray)",
                gridTemplateColumns: "80px 90px 120px 1fr 1fr 130px 28px",
              }}
            >
              <span>Status</span>
              <span>Due Date</span>
              <span>DRI</span>
              <span>Action Item</span>
              <span>Notes</span>
              <span>Est. Time</span>
              <span />
            </div>

            {/* Items */}
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="px-5 py-2 grid gap-2 items-center"
                style={{
                  gridTemplateColumns: "80px 90px 120px 1fr 1fr 130px 28px",
                  borderTop: idx > 0 ? "1px solid var(--color-light-gray)" : "none",
                }}
              >
                <select
                  value={item.status}
                  onChange={(e) => updateItem(phase, item.id, "status", e.target.value)}
                  className="text-xs px-1.5 py-1 focus:outline-none cursor-pointer font-medium"
                  style={{
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: STATUS_COLORS[item.status] + "22",
                    color: STATUS_COLORS[item.status],
                  }}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="date"
                  value={item.dueDate}
                  onChange={(e) => updateItem(phase, item.id, "dueDate", e.target.value)}
                  className="text-xs px-1 py-1 bg-transparent focus:outline-none"
                  style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                />
                <input
                  type="text"
                  value={item.dri}
                  onChange={(e) => updateItem(phase, item.id, "dri", e.target.value)}
                  placeholder="DRI"
                  className="text-xs px-2 py-1 bg-transparent focus:outline-none"
                  style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                />
                <input
                  type="text"
                  value={item.task}
                  onChange={(e) => updateItem(phase, item.id, "task", e.target.value)}
                  placeholder="Action item description"
                  className="text-xs px-2 py-1 bg-transparent focus:outline-none"
                  style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                />
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateItem(phase, item.id, "notes", e.target.value)}
                  placeholder="Notes"
                  className="text-xs px-2 py-1 bg-transparent focus:outline-none"
                  style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                />
                <input
                  type="text"
                  value={item.estimatedTime}
                  onChange={(e) => updateItem(phase, item.id, "estimatedTime", e.target.value)}
                  placeholder="Est. time"
                  className="text-xs px-2 py-1 bg-transparent focus:outline-none"
                  style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                />
                <button
                  onClick={() => removeItem(phase, item.id)}
                  className="flex items-center justify-center w-5 h-5"
                  style={{ color: "var(--color-light-gray)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add item */}
            <div className="px-5 py-2.5" style={{ borderTop: "1px solid var(--color-light-gray)" }}>
              <button
                onClick={() => addItem(phase)}
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-gray)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-applied-blue)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gray)")}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add action item
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
