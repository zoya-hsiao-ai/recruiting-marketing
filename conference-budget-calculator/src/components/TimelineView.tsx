"use client";

import { useState } from "react";
import Link from "next/link";
import type { Conference } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseConferenceMonth(conf: Conference): number | null {
  if (!conf.dates) return null;
  // Try to find a month name in the dates string
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const lower = conf.dates.toLowerCase();
  for (let i = 0; i < 12; i++) {
    if (lower.includes(monthNames[i]) || lower.includes(shortMonths[i])) return i;
  }
  // Try numeric date patterns like "6/5" or "2026-06"
  const numMatch = conf.dates.match(/(\d{1,2})\//) || conf.dates.match(/-(\d{2})-/);
  if (numMatch) {
    const m = parseInt(numMatch[1], 10);
    if (m >= 1 && m <= 12) return m - 1;
  }
  return null;
}

function parseConferenceYear(conf: Conference): number | null {
  const match = conf.name.match(/20\d{2}/) || conf.dates.match(/20\d{2}/);
  return match ? parseInt(match[0], 10) : null;
}

interface Props {
  conferences: Conference[];
}

export default function TimelineView({ conferences }: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get all years from conferences
  const years = Array.from(
    new Set(
      conferences
        .map(parseConferenceYear)
        .filter((y): y is number => y !== null)
    )
  ).sort();

  // If no years detected, show current year
  if (years.length === 0) years.push(currentYear);
  // Always include current year
  if (!years.includes(currentYear)) years.push(currentYear);
  years.sort();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Group conferences by month for selected year
  const byMonth: Record<number, Conference[]> = {};
  for (let i = 0; i < 12; i++) byMonth[i] = [];

  for (const conf of conferences) {
    const year = parseConferenceYear(conf);
    const month = parseConferenceMonth(conf);
    if (year === selectedYear && month !== null) {
      byMonth[month].push(conf);
    }
  }

  // Conferences with no parseable date for selected year
  const unscheduled = conferences.filter((conf) => {
    const year = parseConferenceYear(conf);
    const month = parseConferenceMonth(conf);
    return (year === selectedYear && month === null) || (year === null);
  });

  return (
    <div className="space-y-4">
      {/* Year selector */}
      <div className="flex items-center gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              borderRadius: "var(--radius-sm)",
              background: selectedYear === y ? "var(--color-off-black)" : "var(--color-white)",
              color: selectedYear === y ? "white" : "var(--color-gray)",
              border: selectedYear === y ? "none" : "1px solid var(--color-light-gray)",
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div
        className="p-5 overflow-x-auto"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
      >
        <div style={{ minWidth: "900px" }}>
          {/* Month headers */}
          <div className="grid grid-cols-12 gap-0 mb-1">
            {MONTHS.map((m, i) => (
              <div
                key={m}
                className="text-center text-xs font-medium py-1.5"
                style={{
                  color: i === currentMonth && selectedYear === currentYear ? "var(--color-applied-blue)" : "var(--color-gray)",
                  letterSpacing: "0.04em",
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Timeline track */}
          <div className="relative">
            {/* Background track */}
            <div className="grid grid-cols-12 gap-0">
              {MONTHS.map((_, i) => (
                <div
                  key={i}
                  className="h-1"
                  style={{
                    background:
                      i === currentMonth && selectedYear === currentYear
                        ? "var(--color-applied-blue)"
                        : selectedYear === currentYear && i < currentMonth
                          ? "var(--color-light-gray)"
                          : "var(--color-off-white)",
                  }}
                />
              ))}
            </div>

            {/* Current month indicator */}
            {selectedYear === currentYear && (
              <div
                className="absolute top-0 w-0.5 h-full"
                style={{
                  left: `${((currentMonth + 0.5) / 12) * 100}%`,
                  background: "var(--color-applied-blue)",
                  height: "calc(100% + 8px)",
                  top: "-4px",
                }}
              />
            )}
          </div>

          {/* Conference entries by month */}
          <div className="grid grid-cols-12 gap-0 mt-3">
            {MONTHS.map((_, monthIdx) => {
              const confs = byMonth[monthIdx];
              const isPast = selectedYear < currentYear || (selectedYear === currentYear && monthIdx < currentMonth);
              return (
                <div key={monthIdx} className="px-0.5 space-y-1.5">
                  {confs.map((conf) => (
                    <Link
                      key={conf.id}
                      href={`/conference/${conf.id}`}
                      className="block p-2 transition-shadow hover:shadow-md"
                      style={{
                        background: isPast ? "var(--color-off-white)" : "var(--color-white)",
                        border: "1px solid var(--color-light-gray)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: `3px solid ${
                          conf.status === "completed"
                            ? "#4CAF50"
                            : conf.status === "active"
                              ? "var(--color-applied-blue)"
                              : "#FFC107"
                        }`,
                        textDecoration: "none",
                        opacity: isPast ? 0.7 : 1,
                      }}
                    >
                      <div
                        className="text-xs font-semibold truncate mb-0.5"
                        style={{ color: "var(--color-off-black)" }}
                      >
                        {conf.name}
                      </div>
                      <div className="text-[10px] truncate mb-1" style={{ color: "var(--color-gray)" }}>
                        {conf.location || "TBD"}
                      </div>
                      <StatusBadge status={conf.status} />
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unscheduled conferences */}
      {unscheduled.length > 0 && (
        <div
          className="p-4"
          style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
        >
          <h4 className="text-xs font-medium uppercase mb-3" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
            Dates TBD
          </h4>
          <div className="flex gap-2 flex-wrap">
            {unscheduled.map((conf) => (
              <Link
                key={conf.id}
                href={`/conference/${conf.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs transition-shadow hover:shadow-sm"
                style={{
                  background: "var(--color-off-white)",
                  border: "1px solid var(--color-light-gray)",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  color: "var(--color-off-black)",
                }}
              >
                {conf.name}
                <StatusBadge status={conf.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
