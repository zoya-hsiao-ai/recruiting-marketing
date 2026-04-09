"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConferences } from "@/lib/ConferenceContext";
import Link from "next/link";
import OverviewTab from "@/components/OverviewTab";
import ActionItemsTab from "@/components/ActionItemsTab";
import AttendeesTab from "@/components/AttendeesTab";
import BoothTab from "@/components/BoothTab";
import PrivateEventTab from "@/components/PrivateEventTab";
import CandidateTrackerTab from "@/components/CandidateTrackerTab";
import BudgetTab from "@/components/BudgetTab";
import StrategyTab from "@/components/StrategyTab";
import type { Conference, ConferenceStatus } from "@/lib/types";

const TABS = [
  "Overview",
  "Action Items",
  "Attendees",
  "Booth",
  "Private Event",
  "Candidates",
  "Budget",
  "Strategy",
] as const;

type TabName = (typeof TABS)[number];

export default function ConferenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getConference, updateConference } = useConferences();
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const conf = getConference(params.id as string);

  if (!conf) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-off-white)" }}>
        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: "var(--color-gray)" }}>Conference not found.</p>
          <Link href="/" className="text-sm" style={{ color: "var(--color-applied-blue)" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  function update(updates: Partial<Conference>) {
    updateConference(conf!.id, updates);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-off-white)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10"
        style={{ background: "var(--color-white)", borderBottom: "1px solid var(--color-light-gray)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-gray)" }}>
                <img src="/applied-symbol.svg" alt="Applied Intuition" className="h-4 w-auto" />
                <span>&larr;</span>
              </Link>
              <input
                type="text"
                value={conf.name}
                onChange={(e) => update({ name: e.target.value })}
                className="text-base font-semibold bg-transparent border-0 focus:outline-none"
                style={{ color: "var(--color-off-black)", letterSpacing: "var(--tracking-mid)" }}
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={conf.status}
                onChange={(e) => update({ status: e.target.value as ConferenceStatus })}
                className="text-xs px-2 py-1 font-medium focus:outline-none cursor-pointer"
                style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", color: "var(--color-off-black)" }}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => { if (confirm(`Delete "${conf.name}"?`)) { router.push("/"); setTimeout(() => updateConference(conf.id, {} as never), 0); } }}
                className="text-xs px-2 py-1"
                style={{ color: "var(--color-gray)" }}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Meta fields */}
          <div className="pb-3 flex items-center gap-4 flex-wrap">
            <input
              type="text"
              value={conf.location}
              onChange={(e) => update({ location: e.target.value })}
              placeholder="Location"
              className="text-xs px-2 py-1 bg-transparent focus:outline-none"
              style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", color: "var(--color-off-black)", width: "160px" }}
            />
            <input
              type="text"
              value={conf.dates}
              onChange={(e) => update({ dates: e.target.value })}
              placeholder="Dates"
              className="text-xs px-2 py-1 bg-transparent focus:outline-none"
              style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", color: "var(--color-off-black)", width: "160px" }}
            />
            <input
              type="text"
              value={conf.niche}
              onChange={(e) => update({ niche: e.target.value })}
              placeholder="Niche / Domain"
              className="text-xs px-2 py-1 bg-transparent focus:outline-none"
              style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", color: "var(--color-off-black)", width: "200px" }}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  color: activeTab === tab ? "var(--color-applied-blue)" : "var(--color-gray)",
                  borderBottom: activeTab === tab ? "2px solid var(--color-applied-blue)" : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "Overview" && <OverviewTab conference={conf} update={update} />}
        {activeTab === "Action Items" && <ActionItemsTab conference={conf} update={update} />}
        {activeTab === "Attendees" && <AttendeesTab conference={conf} update={update} />}
        {activeTab === "Booth" && <BoothTab conference={conf} update={update} />}
        {activeTab === "Private Event" && <PrivateEventTab conference={conf} update={update} />}
        {activeTab === "Candidates" && <CandidateTrackerTab conference={conf} update={update} />}
        {activeTab === "Budget" && <BudgetTab conference={conf} update={update} />}
        {activeTab === "Strategy" && <StrategyTab conference={conf} update={update} />}
      </div>
    </div>
  );
}
