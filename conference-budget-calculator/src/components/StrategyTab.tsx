"use client";

import { useState } from "react";
import type { Conference, Strategy } from "@/lib/types";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

const FIELDS: { key: keyof Strategy; label: string; placeholder: string }[] = [
  { key: "goals", label: "Goals & Objectives", placeholder: "What does the company aim to achieve at this conference?" },
  { key: "targetProfiles", label: "Target Candidate Profiles", placeholder: "Who do we want to meet/source? (roles, seniority, research areas)" },
  { key: "keyMessages", label: "Key Messages / Talking Points", placeholder: "Positioning, value props, conversation starters for booth and events" },
  { key: "successMetrics", label: "Success Metrics", placeholder: "How do we measure whether this conference was worth it?" },
];

export default function StrategyTab({ conference: conf, update }: Props) {
  const [editing, setEditing] = useState(true);

  function updateStrategy(field: keyof Strategy, value: string) {
    update({ strategy: { ...conf.strategy, [field]: value } });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
          Recruiting Strategy
        </h3>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs font-medium px-3 py-1.5"
          style={{ color: "var(--color-applied-blue)", border: "1px solid var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
        >
          {editing ? "View" : "Edit"}
        </button>
      </div>

      {FIELDS.map(({ key, label, placeholder }) => (
        <div
          key={key}
          className="p-5"
          style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
        >
          <label className="text-xs font-semibold uppercase block mb-3" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
            {label}
          </label>
          {editing ? (
            <textarea
              value={conf.strategy[key]}
              onChange={(e) => updateStrategy(key, e.target.value)}
              placeholder={placeholder}
              className="text-sm w-full px-3 py-2 focus:outline-none"
              style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", color: "var(--color-off-black)" }}
              rows={4}
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap" style={{ color: conf.strategy[key] ? "var(--color-off-black)" : "var(--color-light-gray)" }}>
              {conf.strategy[key] || "Not yet defined."}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
