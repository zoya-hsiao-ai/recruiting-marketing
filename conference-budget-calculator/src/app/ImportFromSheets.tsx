"use client";

import { useState, useEffect, useRef } from "react";

export type CategoryName = "Venue" | "Catering" | "Speakers" | "Travel" | "Swag";
export type CostCenter = "Marketing" | "Recruiting" | "Operations" | "Executive";

export interface ImportedItem {
  name: string;
  amount: number;
  category: CategoryName;
  costCenter: CostCenter;
}

interface Props {
  requestToken: string;
  onImport: (items: ImportedItem[]) => void;
  onClose: () => void;
}

interface ParsedRow {
  id: string;
  name: string;
  amount: number;
  category: CategoryName;
  costCenter: CostCenter;
  selected: boolean;
}

const CATEGORIES: CategoryName[] = ["Venue", "Catering", "Speakers", "Travel", "Swag"];
const COST_CENTERS: CostCenter[] = ["Marketing", "Recruiting", "Operations", "Executive"];

const CATEGORY_KEYWORDS: [string, CategoryName][] = [
  ["venue", "Venue"], ["location", "Venue"], ["space", "Venue"], ["room", "Venue"], ["facility", "Venue"], ["av", "Venue"], ["audio", "Venue"], ["equipment", "Venue"],
  ["cater", "Catering"], ["food", "Catering"], ["beverage", "Catering"], ["meal", "Catering"], ["lunch", "Catering"], ["dinner", "Catering"], ["breakfast", "Catering"], ["coffee", "Catering"], ["snack", "Catering"], ["reception", "Catering"],
  ["speaker", "Speakers"], ["keynote", "Speakers"], ["presenter", "Speakers"], ["honorar", "Speakers"],
  ["travel", "Travel"], ["flight", "Travel"], ["hotel", "Travel"], ["accommodation", "Travel"], ["transport", "Travel"], ["lodging", "Travel"], ["airfare", "Travel"],
  ["swag", "Swag"], ["merch", "Swag"], ["shirt", "Swag"], ["bag", "Swag"], ["gift", "Swag"], ["promo", "Swag"], ["print", "Swag"], ["badge", "Swag"],
];

const COST_CENTER_KEYWORDS: [string, CostCenter][] = [
  ["recruit", "Recruiting"], ["hiring", "Recruiting"], ["candidate", "Recruiting"],
  ["market", "Marketing"], ["brand", "Marketing"], ["sponsor", "Marketing"],
  ["exec", "Executive"], ["leadership", "Executive"], ["vip", "Executive"],
];

function detectCategory(text: string, fallback: CategoryName): CategoryName {
  const lower = text.toLowerCase();
  for (const [kw, cat] of CATEGORY_KEYWORDS) {
    if (lower.includes(kw)) return cat;
  }
  return fallback;
}

function detectCostCenter(text: string, category: CategoryName): CostCenter {
  const lower = text.toLowerCase();
  for (const [kw, cc] of COST_CENTER_KEYWORDS) {
    if (lower.includes(kw)) return cc;
  }
  const defaults: Record<CategoryName, CostCenter> = {
    Venue: "Operations",
    Catering: "Operations",
    Speakers: "Marketing",
    Travel: "Operations",
    Swag: "Marketing",
  };
  return defaults[category];
}

function parseAmount(cell: string): number {
  const n = parseFloat(String(cell).replace(/[$,\s]/g, ""));
  return isNaN(n) || n <= 0 ? 0 : n;
}

function parseSheetValues(rows: string[][]): ParsedRow[] {
  const items: ParsedRow[] = [];
  let currentCategory: CategoryName = "Venue";
  let rowId = 0;

  for (const row of rows) {
    if (!row || row.length === 0) continue;
    const firstCell = String(row[0] ?? "").trim();
    if (!firstCell) continue;

    // Find the first positive number in the row (skip col 0)
    let amount = 0;
    for (let i = 1; i < row.length; i++) {
      const n = parseAmount(row[i]);
      if (n > 0) { amount = n; break; }
    }

    if (amount === 0) {
      // Treat as a potential category header
      const cat = detectCategory(firstCell, currentCategory);
      // Only update if the text strongly matches a category
      const lower = firstCell.toLowerCase();
      if (CATEGORY_KEYWORDS.some(([kw]) => lower.includes(kw))) {
        currentCategory = cat;
      }
      continue;
    }

    const category = detectCategory(firstCell, currentCategory);
    items.push({
      id: String(rowId++),
      name: firstCell,
      amount,
      category,
      costCenter: detectCostCenter(firstCell, category),
      selected: true,
    });
  }

  return items;
}

function extractSpreadsheetId(input: string): string | null {
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  // Maybe they pasted just the ID
  if (/^[a-zA-Z0-9-_]{20,}$/.test(input.trim())) return input.trim();
  return null;
}

type Step = "connect" | "url" | "sheet_select" | "preview";

export default function ImportFromSheets({ requestToken, onImport, onClose }: Props) {
  const [step, setStep] = useState<Step>("connect");
  const [isConnected, setIsConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [connectingOAuth, setConnectingOAuth] = useState(false);

  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState("");

  const popupRef = useRef<Window | null>(null);

  // Check Google Sheets connection on mount
  useEffect(() => {
    async function check() {
      setCheckingConnection(true);
      try {
        const resp = await fetch("/api/connections", {
          headers: { "X-Request-Token": requestToken },
        });
        const data = await resp.json();
        const connected = (data.connections ?? []).some(
          (c: { provider: string }) =>
            c.provider === "google-sheets" || c.provider === "sheets"
        );
        setIsConnected(connected);
        setStep(connected ? "url" : "connect");
      } catch {
        setStep("connect");
      } finally {
        setCheckingConnection(false);
      }
    }
    check();
  }, [requestToken]);

  async function connectSheets() {
    setConnectingOAuth(true);
    setError("");
    try {
      const resp = await fetch("/api/connect/sheets", {
        method: "POST",
        headers: { "X-Request-Token": requestToken },
      });
      const data = await resp.json();
      if (!data.url) throw new Error(data.error ?? "No OAuth URL returned");

      const popup = window.open(data.url, "_blank", "width=600,height=700");
      popupRef.current = popup;

      const interval = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(interval);
          setConnectingOAuth(false);
          // Re-check connection
          const r = await fetch("/api/connections", {
            headers: { "X-Request-Token": requestToken },
          });
          const d = await r.json();
          const connected = (d.connections ?? []).some(
            (c: { provider: string }) =>
              c.provider === "google-sheets" || c.provider === "sheets"
          );
          if (connected) {
            setIsConnected(true);
            setStep("url");
          } else {
            setError("Connection not completed. Please try again.");
          }
        }
      }, 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start OAuth");
      setConnectingOAuth(false);
    }
  }

  async function loadSpreadsheet() {
    setError("");
    const id = extractSpreadsheetId(spreadsheetUrl);
    if (!id) {
      setError("Couldn't parse a spreadsheet ID from that URL. Paste the full Google Sheets URL.");
      return;
    }
    setSpreadsheetId(id);
    setLoadingData(true);
    try {
      const resp = await fetch(`/api/sheets?id=${id}`, {
        headers: { "X-Request-Token": requestToken },
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Failed to load spreadsheet");

      const names: string[] = (data.sheets ?? []).map(
        (s: { properties: { title: string } }) => s.properties.title
      );
      if (names.length === 0) throw new Error("No sheets found in this spreadsheet");

      setSheetNames(names);
      if (names.length === 1) {
        setSelectedSheet(names[0]);
        await loadSheetData(id, names[0]);
      } else {
        setSelectedSheet(names[0]);
        setStep("sheet_select");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load spreadsheet");
    } finally {
      setLoadingData(false);
    }
  }

  async function loadSheetData(id: string, sheet: string) {
    setLoadingData(true);
    setError("");
    try {
      const resp = await fetch(
        `/api/sheets?id=${id}&sheet=${encodeURIComponent(sheet)}`,
        { headers: { "X-Request-Token": requestToken } }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Failed to load sheet data");

      const parsed = parseSheetValues(data.values ?? []);
      if (parsed.length === 0) throw new Error("No line items detected in this sheet.");
      setRows(parsed);
      setStep("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sheet data");
    } finally {
      setLoadingData(false);
    }
  }

  function toggleRow(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  }

  function updateRowField(id: string, field: "category" | "costCenter", value: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  }

  function handleImport() {
    const selected = rows.filter((r) => r.selected);
    onImport(selected.map(({ name, amount, category, costCenter }) => ({ name, amount, category, costCenter })));
  }

  const isDone = (s: "connect" | "url" | "preview") =>
    (step === "url" && s === "connect") ||
    (step === "sheet_select" && s !== "preview") ||
    (step === "preview" && s !== "preview");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col shadow-xl"
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-light-gray)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-light-gray)" }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--color-off-black)", letterSpacing: "var(--tracking-mid)" }}
          >
            Import from Google Sheets
          </h2>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: "var(--color-gray)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-off-black)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-gray)")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2">
          {(["connect", "url", "preview"] as const).map((s, i) => {
            const done = isDone(s);
            const active = step === s || (step === "sheet_select" && s === "url");
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
                  style={{
                    background: done ? "#059669" : active ? "var(--color-off-black)" : "var(--color-off-white)",
                    color: done || active ? "var(--color-white)" : "var(--color-gray)",
                    border: `1px solid ${done ? "#059669" : active ? "var(--color-off-black)" : "var(--color-light-gray)"}`,
                  }}
                >
                  {done ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: active ? "var(--color-off-black)" : "var(--color-gray)" }}
                >
                  {s === "connect" ? "Connect" : s === "url" ? "Spreadsheet" : "Import"}
                </span>
                {i < 2 && <div className="w-6 h-px" style={{ background: "var(--color-light-gray)" }} />}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div
              className="mb-4 px-4 py-3 text-sm"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-md)",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {/* Step: Connect */}
          {step === "connect" && (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              {checkingConnection ? (
                <p className="text-sm" style={{ color: "var(--color-gray)" }}>Checking connection...</p>
              ) : (
                <>
                  <div
                    className="w-14 h-14 flex items-center justify-center text-2xl"
                    style={{
                      background: "var(--color-off-white)",
                      border: "1px solid var(--color-light-gray)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    📊
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--color-off-black)" }}>
                      Connect Google Sheets
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-gray)" }}>
                      Authorize access to read your spreadsheets
                    </p>
                  </div>
                  <button
                    onClick={connectSheets}
                    disabled={connectingOAuth}
                    className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                    style={{
                      background: "var(--color-off-black)",
                      color: "var(--color-white)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {connectingOAuth ? "Opening authorization..." : "Connect Google Sheets"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step: URL input */}
          {step === "url" && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <label
                  className="block text-xs font-medium uppercase mb-2"
                  style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}
                >
                  Spreadsheet URL or ID
                </label>
                <input
                  type="text"
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full text-sm px-3 py-2 focus:outline-none transition-colors"
                  style={{
                    background: "var(--color-off-white)",
                    border: "1px solid var(--color-light-gray)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-off-black)",
                  }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--color-applied-blue)")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--color-light-gray)")}
                  onKeyDown={(e) => e.key === "Enter" && loadSpreadsheet()}
                />
              </div>
              <button
                onClick={loadSpreadsheet}
                disabled={!spreadsheetUrl || loadingData}
                className="self-start px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
                style={{
                  background: "var(--color-off-black)",
                  color: "var(--color-white)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {loadingData ? "Loading..." : "Load spreadsheet"}
              </button>
            </div>
          )}

          {/* Step: Sheet selection */}
          {step === "sheet_select" && (
            <div className="flex flex-col gap-4 py-2">
              <div>
                <label
                  className="block text-xs font-medium uppercase mb-2"
                  style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}
                >
                  Select a sheet
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sheetNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => setSelectedSheet(name)}
                      className="px-3 py-2 text-sm font-medium text-left transition-colors"
                      style={{
                        background: selectedSheet === name ? "var(--color-off-black)" : "var(--color-off-white)",
                        color: selectedSheet === name ? "var(--color-white)" : "var(--color-dark-gray)",
                        border: `1px solid ${selectedSheet === name ? "var(--color-off-black)" : "var(--color-light-gray)"}`,
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => loadSheetData(spreadsheetId!, selectedSheet)}
                disabled={!selectedSheet || loadingData}
                className="self-start px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
                style={{
                  background: "var(--color-off-black)",
                  color: "var(--color-white)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {loadingData ? "Loading..." : "Load sheet"}
              </button>
            </div>
          )}

          {/* Step: Preview */}
          {step === "preview" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--color-gray)" }}>
                  {rows.filter((r) => r.selected).length} of {rows.length} items selected
                </p>
                <button
                  onClick={() =>
                    setRows((prev) => {
                      const allSelected = prev.every((r) => r.selected);
                      return prev.map((r) => ({ ...r, selected: !allSelected }));
                    })
                  }
                  className="text-xs transition-colors"
                  style={{ color: "var(--color-gray)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-applied-blue)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-gray)")}
                >
                  Toggle all
                </button>
              </div>

              <div
                className="overflow-hidden"
                style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-md)" }}
              >
                <div
                  className="grid grid-cols-[auto_1fr_90px_120px_120px] gap-2 px-3 py-2 text-xs font-medium uppercase"
                  style={{
                    background: "var(--color-off-white)",
                    color: "var(--color-gray)",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid var(--color-light-gray)",
                  }}
                >
                  <span />
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Category</span>
                  <span>Cost Center</span>
                </div>
                {rows.map((row, idx) => (
                  <div
                    key={row.id}
                    className={`grid grid-cols-[auto_1fr_90px_120px_120px] gap-2 px-3 py-2 items-center text-sm transition-opacity ${
                      row.selected ? "" : "opacity-40"
                    }`}
                    style={{
                      borderTop: idx === 0 ? "none" : "1px solid var(--color-off-white)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={() => toggleRow(row.id)}
                      style={{ accentColor: "var(--color-off-black)" }}
                    />
                    <span className="truncate" style={{ color: "var(--color-off-black)" }}>{row.name}</span>
                    <span className="tabular-nums" style={{ color: "var(--color-dark-gray)" }}>
                      ${row.amount.toLocaleString()}
                    </span>
                    <select
                      value={row.category}
                      onChange={(e) => updateRowField(row.id, "category", e.target.value)}
                      className="text-xs px-1.5 py-1 focus:outline-none"
                      style={{
                        background: "var(--color-off-white)",
                        border: "1px solid var(--color-light-gray)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--color-off-black)",
                      }}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={row.costCenter}
                      onChange={(e) => updateRowField(row.id, "costCenter", e.target.value)}
                      className="text-xs px-1.5 py-1 focus:outline-none"
                      style={{
                        background: "var(--color-off-white)",
                        border: "1px solid var(--color-light-gray)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--color-off-black)",
                      }}
                    >
                      {COST_CENTERS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "preview" && (
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--color-light-gray)" }}
          >
            <button
              onClick={() => setStep("url")}
              className="text-sm transition-colors"
              style={{ color: "var(--color-gray)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-off-black)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-gray)")}
            >
              ← Back
            </button>
            <button
              onClick={handleImport}
              disabled={rows.filter((r) => r.selected).length === 0}
              className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
              style={{
                background: "var(--color-applied-blue)",
                color: "var(--color-white)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              Import {rows.filter((r) => r.selected).length} items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
