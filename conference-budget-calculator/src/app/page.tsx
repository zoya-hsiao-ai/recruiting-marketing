"use client";

import { useState } from "react";
import { useConferences } from "@/lib/ConferenceContext";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import TimelineView from "@/components/TimelineView";

function getActionItemStats(actionItems: Record<string, unknown[]>) {
  let total = 0;
  let completed = 0;
  for (const items of Object.values(actionItems)) {
    for (const item of items as { status: string }[]) {
      total++;
      if (item.status === "completed") completed++;
    }
  }
  return { total, completed };
}

export default function Dashboard() {
  const { conferences, addConference, deleteConference } = useConferences();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [view, setView] = useState<"cards" | "timeline">("cards");

  const sorted = [...conferences].sort((a, b) => {
    const order = { active: 0, planning: 1, completed: 2 };
    return (order[a.status] ?? 1) - (order[b.status] ?? 1);
  });

  function handleCreate() {
    if (!newName.trim()) return;
    addConference(newName.trim());
    setNewName("");
    setShowNew(false);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-off-white)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ background: "var(--color-white)", borderBottom: "1px solid var(--color-light-gray)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/applied-symbol.svg" alt="" className="h-5 w-auto" />
            <img src="/applied-wordmark.svg" alt="Applied Intuition" className="h-4 w-auto" />
            <span className="text-sm" style={{ color: "var(--color-light-gray)" }}>|</span>
            <h1 className="text-sm font-medium" style={{ color: "var(--color-gray)", letterSpacing: "var(--tracking-mid)" }}>
              Conference DRI Hub
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNew(true)}
              className="px-3 py-1.5 text-xs font-medium text-white transition-colors"
              style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
            >
              + New Conference
            </button>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{ height: "160px" }}
      >
        <img
          src="/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(17,17,17,0.7) 0%, rgba(17,17,17,0.3) 50%, transparent 100%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 h-full flex items-center">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1" style={{ letterSpacing: "var(--tracking-tight)" }}>
              Conference DRI Hub
            </h2>
            <p className="text-xs text-white/60">
              Plan, track, and execute conferences end-to-end
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* View toggle */}
        {sorted.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1 p-0.5" style={{ background: "var(--color-off-white)", borderRadius: "var(--radius-sm)" }}>
              <button
                onClick={() => setView("cards")}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: "var(--radius-sm)",
                  background: view === "cards" ? "var(--color-white)" : "transparent",
                  color: view === "cards" ? "var(--color-off-black)" : "var(--color-gray)",
                  boxShadow: view === "cards" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}
              >
                Cards
              </button>
              <button
                onClick={() => setView("timeline")}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  borderRadius: "var(--radius-sm)",
                  background: view === "timeline" ? "var(--color-white)" : "transparent",
                  color: view === "timeline" ? "var(--color-off-black)" : "var(--color-gray)",
                  boxShadow: view === "timeline" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}
              >
                Timeline
              </button>
            </div>
          </div>
        )}

        {showNew && (
          <div
            className="mb-6 p-4 flex items-center gap-3"
            style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
          >
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Conference name (e.g. CVPR 2026)"
              className="flex-1 text-sm px-3 py-2 focus:outline-none"
              style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 text-xs font-medium text-white"
              style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
            >
              Create
            </button>
            <button
              onClick={() => { setShowNew(false); setNewName(""); }}
              className="px-3 py-2 text-xs"
              style={{ color: "var(--color-gray)" }}
            >
              Cancel
            </button>
          </div>
        )}

        {view === "timeline" && sorted.length > 0 ? (
          <TimelineView conferences={conferences} />
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm mb-4" style={{ color: "var(--color-gray)" }}>
              No conferences yet. Create one to get started.
            </p>
            <button
              onClick={() => setShowNew(true)}
              className="px-4 py-2 text-sm font-medium text-white"
              style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
            >
              + New Conference
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((conf) => {
              const stats = getActionItemStats(conf.actionItems);
              return (
                <Link
                  key={conf.id}
                  href={`/conference/${conf.id}`}
                  className="block transition-shadow hover:shadow-md"
                  style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", textDecoration: "none" }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-off-black)" }}>
                          {conf.name}
                        </h2>
                        <p className="text-xs" style={{ color: "var(--color-gray)" }}>
                          {conf.location || "Location TBD"} &middot; {conf.dates || "Dates TBD"}
                        </p>
                      </div>
                      <StatusBadge status={conf.status} />
                    </div>
                    {conf.niche && (
                      <p className="text-xs mb-3" style={{ color: "var(--color-gray)" }}>{conf.niche}</p>
                    )}
                    <div className="mb-3">
                      <ProgressBar completed={stats.completed} total={stats.total} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--color-off-white)", color: "var(--color-gray)" }}>
                        {conf.attendees.length} attendees
                      </span>
                      {conf.hasBooth && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--color-off-white)", color: "var(--color-gray)" }}>
                          Booth
                        </span>
                      )}
                      {conf.hasPrivateEvent && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--color-off-white)", color: "var(--color-gray)" }}>
                          Private Event
                        </span>
                      )}
                      {conf.candidates.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--color-off-white)", color: "var(--color-gray)" }}>
                          {conf.candidates.length} leads
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="px-5 py-2 flex justify-end"
                    style={{ borderTop: "1px solid var(--color-light-gray)" }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (confirm(`Delete "${conf.name}"?`)) deleteConference(conf.id);
                      }}
                      className="text-xs transition-colors"
                      style={{ color: "var(--color-light-gray)" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}
                    >
                      Delete
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
