"use client";

import { useState } from "react";
import type { Conference, Candidate, InviteToInterview, CandidateSource } from "@/lib/types";
import { genId } from "@/lib/defaults";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

const SOURCE_LABELS: Record<CandidateSource, string> = {
  booth_conversation: "Booth Conversation",
  breakfast_attendee: "Breakfast Attendee",
  pre_conference_outreach: "Pre-Conference Outreach",
  paper_author: "Paper Author",
  scanner: "Scanner",
  referral: "Referral",
  other: "Other",
};

const INVITE_COLORS: Record<InviteToInterview, { bg: string; color: string }> = {
  yes: { bg: "#E8F5E922", color: "#2E7D32" },
  no: { bg: "#FFEBEE22", color: "#C62828" },
  tbd: { bg: "#FFF8E122", color: "#F57F17" },
};

export default function CandidateTrackerTab({ conference: conf, update }: Props) {
  const [filterInvite, setFilterInvite] = useState<InviteToInterview | "all">("all");
  const [filterSource, setFilterSource] = useState<CandidateSource | "all">("all");
  const [search, setSearch] = useState("");

  const candidates = conf.candidates;

  function updateCandidates(newCandidates: Candidate[]) {
    update({ candidates: newCandidates });
  }

  function updateCandidate(id: string, field: keyof Candidate, value: unknown) {
    updateCandidates(candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function addCandidate() {
    updateCandidates([
      ...candidates,
      {
        id: genId("cand"),
        firstName: "",
        lastName: "",
        email: "",
        linkedin: "",
        inviteToInterview: "tbd",
        notes: "",
        company: "",
        school: "",
        reason: "",
        phoneNumber: "",
        location: "",
        atsLink: "",
        addedToAts: false,
        source: "other",
        addedBy: "",
        dateAdded: new Date().toISOString(),
      },
    ]);
  }

  function removeCandidate(id: string) {
    updateCandidates(candidates.filter((c) => c.id !== id));
  }

  function bulkMarkAts() {
    updateCandidates(candidates.map((c) => ({ ...c, addedToAts: true })));
  }

  const filtered = candidates.filter((c) => {
    if (filterInvite !== "all" && c.inviteToInterview !== filterInvite) return false;
    if (filterSource !== "all" && c.source !== filterSource) return false;
    if (search) {
      const s = search.toLowerCase();
      const match = `${c.firstName} ${c.lastName} ${c.company} ${c.school}`.toLowerCase();
      if (!match.includes(s)) return false;
    }
    return true;
  });

  const yesCount = candidates.filter((c) => c.inviteToInterview === "yes").length;
  const tbdCount = candidates.filter((c) => c.inviteToInterview === "tbd").length;

  return (
    <div className="space-y-4">
      {/* Stats & filters */}
      <div className="p-4 flex items-center gap-4 flex-wrap" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--color-off-white)" }}>
          <span style={{ color: "var(--color-gray)" }}>Total: </span><span className="font-medium">{candidates.length}</span>
        </div>
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "#E8F5E9" }}>
          <span style={{ color: "#2E7D32" }}>Interview Yes: {yesCount} ({candidates.length ? Math.round((yesCount / candidates.length) * 100) : 0}%)</span>
        </div>
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "#FFF8E1" }}>
          <span style={{ color: "#F57F17" }}>TBD: {tbdCount}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, school..."
            className="text-xs px-2 py-1.5 focus:outline-none w-48"
            style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
          />
          <select value={filterInvite} onChange={(e) => setFilterInvite(e.target.value as InviteToInterview | "all")} className="text-xs px-2 py-1.5 focus:outline-none cursor-pointer" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}>
            <option value="all">All Status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="tbd">TBD</option>
          </select>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value as CandidateSource | "all")} className="text-xs px-2 py-1.5 focus:outline-none cursor-pointer" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}>
            <option value="all">All Sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={addCandidate} className="text-xs font-medium px-3 py-1.5 text-white" style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}>
          + Add Candidate
        </button>
        {candidates.length > 0 && (
          <button onClick={bulkMarkAts} className="text-xs font-medium px-3 py-1.5" style={{ color: "var(--color-gray)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}>
            Mark All as Added to ATS
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <table className="w-full text-xs" style={{ minWidth: "1400px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
              {["First", "Last", "Email", "LinkedIn", "Interview?", "Notes", "Company", "School", "Source", "Added to ATS", "Added By", ""].map((h) => (
                <th key={h} className="px-2 py-2 text-left font-medium uppercase whitespace-nowrap" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                <td className="px-2 py-1.5"><input type="text" value={c.firstName} onChange={(e) => updateCandidate(c.id, "firstName", e.target.value)} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5"><input type="text" value={c.lastName} onChange={(e) => updateCandidate(c.id, "lastName", e.target.value)} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5"><input type="email" value={c.email} onChange={(e) => updateCandidate(c.id, "email", e.target.value)} className="w-36 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5"><input type="text" value={c.linkedin} onChange={(e) => updateCandidate(c.id, "linkedin", e.target.value)} className="w-28 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} placeholder="URL" /></td>
                <td className="px-2 py-1.5">
                  <select value={c.inviteToInterview} onChange={(e) => updateCandidate(c.id, "inviteToInterview", e.target.value)} className="text-xs px-1 py-0.5 focus:outline-none cursor-pointer font-medium" style={{ border: "none", borderRadius: "var(--radius-sm)", background: INVITE_COLORS[c.inviteToInterview].bg, color: INVITE_COLORS[c.inviteToInterview].color }}>
                    <option value="tbd">TBD</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td className="px-2 py-1.5"><input type="text" value={c.notes} onChange={(e) => updateCandidate(c.id, "notes", e.target.value)} className="w-40 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5"><input type="text" value={c.company} onChange={(e) => updateCandidate(c.id, "company", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5"><input type="text" value={c.school} onChange={(e) => updateCandidate(c.id, "school", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5">
                  <select value={c.source} onChange={(e) => updateCandidate(c.id, "source", e.target.value)} className="text-xs px-1 py-0.5 focus:outline-none cursor-pointer" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}>
                    {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input type="checkbox" checked={c.addedToAts} onChange={(e) => updateCandidate(c.id, "addedToAts", e.target.checked)} className="accent-[var(--color-applied-blue)]" />
                </td>
                <td className="px-2 py-1.5"><input type="text" value={c.addedBy} onChange={(e) => updateCandidate(c.id, "addedBy", e.target.value)} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                <td className="px-2 py-1.5">
                  <button onClick={() => removeCandidate(c.id)} style={{ color: "var(--color-light-gray)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs mb-2" style={{ color: "var(--color-gray)" }}>No candidates yet.</p>
            <button onClick={addCandidate} className="text-xs" style={{ color: "var(--color-applied-blue)" }}>+ Add first candidate</button>
          </div>
        )}
      </div>
    </div>
  );
}
