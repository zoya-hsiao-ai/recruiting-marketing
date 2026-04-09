"use client";

import type { Conference } from "@/lib/types";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

export default function OverviewTab({ conference: conf, update }: Props) {
  const phases = Object.entries(conf.actionItems);
  let totalItems = 0;
  let completedItems = 0;
  for (const [, items] of phases) {
    totalItems += items.length;
    completedItems += items.filter((i) => i.status === "completed").length;
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Action Items", value: `${completedItems}/${totalItems}` },
          { label: "Attendees", value: String(conf.attendees.length) },
          { label: "Booth", value: conf.hasBooth ? "Yes" : "No" },
          { label: "Private Event", value: conf.hasPrivateEvent ? "Yes" : "No" },
          { label: "Candidate Leads", value: String(conf.candidates.length) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4"
            style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
          >
            <div className="text-xs font-medium mb-1" style={{ color: "var(--color-gray)" }}>{stat.label}</div>
            <div className="text-lg font-semibold tabular-nums" style={{ color: "var(--color-off-black)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick toggles */}
      <div
        className="p-5"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
      >
        <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
          Quick Toggles
        </h3>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--color-off-black)" }}>
            <input
              type="checkbox"
              checked={conf.hasBooth}
              onChange={(e) => update({ hasBooth: e.target.checked })}
              className="accent-[var(--color-applied-blue)]"
            />
            Has Booth
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--color-off-black)" }}>
            <input
              type="checkbox"
              checked={conf.hasPrivateEvent}
              onChange={(e) => update({ hasPrivateEvent: e.target.checked })}
              className="accent-[var(--color-applied-blue)]"
            />
            Has Private Event
          </label>
        </div>
      </div>

      {/* Strategy snapshot */}
      {(conf.strategy.goals || conf.strategy.targetProfiles) && (
        <div
          className="p-5"
          style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
        >
          <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
            Strategy Snapshot
          </h3>
          {conf.strategy.goals && (
            <div className="mb-3">
              <div className="text-xs font-medium mb-1" style={{ color: "var(--color-gray)" }}>Goals</div>
              <p className="text-sm" style={{ color: "var(--color-off-black)" }}>{conf.strategy.goals}</p>
            </div>
          )}
          {conf.strategy.targetProfiles && (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--color-gray)" }}>Target Profiles</div>
              <p className="text-sm" style={{ color: "var(--color-off-black)" }}>{conf.strategy.targetProfiles}</p>
            </div>
          )}
        </div>
      )}

      {/* Phase progress */}
      <div
        className="p-5"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
      >
        <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
          Progress by Phase
        </h3>
        <div className="space-y-4">
          {phases.map(([phase, items]) => {
            const done = items.filter((i) => i.status === "completed").length;
            return (
              <div key={phase}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: "var(--color-off-black)" }}>{phase}</span>
                  <StatusBadge
                    status={done === items.length && items.length > 0 ? "completed" : done > 0 ? "in_progress" : "not_started"}
                  />
                </div>
                <ProgressBar completed={done} total={items.length} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
