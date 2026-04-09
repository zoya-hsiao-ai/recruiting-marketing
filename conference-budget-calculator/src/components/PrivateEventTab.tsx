"use client";

import type { Conference, PrivateEvent } from "@/lib/types";
import { createDefaultPrivateEvent } from "@/lib/defaults";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

export default function PrivateEventTab({ conference: conf, update }: Props) {
  if (!conf.hasPrivateEvent) {
    return (
      <div className="text-center py-20">
        <p className="text-sm mb-4" style={{ color: "var(--color-gray)" }}>No private event for this conference.</p>
        <button
          onClick={() => update({ hasPrivateEvent: true, privateEvent: createDefaultPrivateEvent() })}
          className="px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
        >
          + Add Private Event
        </button>
      </div>
    );
  }

  const pe = conf.privateEvent;

  function updatePE(updates: Partial<PrivateEvent>) {
    update({ privateEvent: { ...pe, ...updates } });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
          Private Event Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Event Name</label>
            <input
              type="text"
              value={conf.privateEventName}
              onChange={(e) => update({ privateEventName: e.target.value })}
              placeholder="e.g. Breakfast Events Day 1 & Day 2"
              className="text-sm px-3 py-1.5 w-full focus:outline-none"
              style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Venue</label>
              <input type="text" value={pe.venue} onChange={(e) => updatePE({ venue: e.target.value })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Capacity</label>
              <input type="text" value={pe.capacity} onChange={(e) => updatePE({ capacity: e.target.value })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Catering Status</label>
            <input type="text" value={pe.catering} onChange={(e) => updatePE({ catering: e.target.value })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Invite Deadline</label>
              <input type="date" value={pe.inviteDeadline} onChange={(e) => updatePE({ inviteDeadline: e.target.value })} className="text-sm px-3 py-1.5 focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>RSVP Count</label>
              <input type="number" value={pe.rsvpCount || ""} onChange={(e) => updatePE({ rsvpCount: Number(e.target.value) })} className="text-sm px-3 py-1.5 focus:outline-none tabular-nums" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--color-off-black)" }}>
            <input type="checkbox" checked={pe.invitesSent} onChange={(e) => updatePE({ invitesSent: e.target.checked })} className="accent-[var(--color-applied-blue)]" />
            Invites Sent
          </label>
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Notes</label>
            <textarea value={pe.notes} onChange={(e) => updatePE({ notes: e.target.value })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} rows={5} placeholder="Schedule, format, run-of-show details..." />
          </div>
        </div>
      </div>
    </div>
  );
}
