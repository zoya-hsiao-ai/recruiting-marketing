"use client";

import { useState, useEffect, useRef } from "react";
import ImportFromSheets, { type ImportedItem } from "./ImportFromSheets";

type CostCenter = "Marketing" | "Recruiting" | "Operations" | "Executive";
type CategoryName = "Venue" | "Catering" | "Speakers" | "Travel" | "Swag";

const COST_CENTERS: CostCenter[] = ["Marketing", "Recruiting", "Operations", "Executive"];
const CATEGORIES: CategoryName[] = ["Venue", "Catering", "Speakers", "Travel", "Swag"];

const CATEGORY_COLORS: Record<CategoryName, string> = {
  Venue:    "#006cfa",
  Catering: "#0047cc",
  Speakers: "#282b31",
  Travel:   "#5b616e",
  Swag:     "#8a919e",
};

const COST_CENTER_COLORS: Record<CostCenter, string> = {
  Marketing:  "#006cfa",
  Recruiting: "#0047cc",
  Operations: "#282b31",
  Executive:  "#5b616e",
};

const CATEGORY_ICONS: Record<CategoryName, string> = {
  Venue:    "🏛️",
  Catering: "🍽️",
  Speakers: "🎤",
  Travel:   "✈️",
  Swag:     "🎁",
};

interface LineItem {
  id: string;
  name: string;
  category: CategoryName;
  unitCost: string;
  qtyType: "per-person" | "fixed";
  qtyPer: CostCenter[];  // which cost centers contribute to qty
  manualQty: string;     // used when qtyType === "fixed"
  costCenter: CostCenter;
}

let _id = 100;
const genId = () => String(++_id);

const ALL_CC: CostCenter[] = [...COST_CENTERS];

function buildDefaults(): LineItem[] {
  return [
    { id: "t1", name: "Hotel (per person/night)",   category: "Travel",   unitCost: "300", qtyType: "per-person", qtyPer: ALL_CC, manualQty: "",     costCenter: "Operations" },
    { id: "t2", name: "Flights (roundtrip)",         category: "Travel",   unitCost: "450", qtyType: "per-person", qtyPer: ALL_CC, manualQty: "",     costCenter: "Operations" },
    { id: "t3", name: "Ground Transportation",       category: "Travel",   unitCost: "80",  qtyType: "per-person", qtyPer: ALL_CC, manualQty: "",     costCenter: "Operations" },
    { id: "c1", name: "Meals & Incidentals",         category: "Catering", unitCost: "300", qtyType: "per-person", qtyPer: ALL_CC, manualQty: "",     costCenter: "Operations" },
    { id: "c2", name: "Evening Reception",           category: "Catering", unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "1",    costCenter: "Marketing"  },
    { id: "v1", name: "Venue / Booth Space",         category: "Venue",    unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "1",    costCenter: "Operations" },
    { id: "v2", name: "AV Equipment",                category: "Venue",    unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "1",    costCenter: "Operations" },
    { id: "s1", name: "Conference Registration",     category: "Speakers", unitCost: "750", qtyType: "per-person", qtyPer: ALL_CC, manualQty: "",     costCenter: "Operations" },
    { id: "s2", name: "Speaker Honoraria",           category: "Speakers", unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "1",    costCenter: "Marketing"  },
    { id: "w1", name: "T-Shirts / Apparel",          category: "Swag",     unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "100",  costCenter: "Marketing"  },
    { id: "w2", name: "Tote Bags",                   category: "Swag",     unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "500",  costCenter: "Marketing"  },
    { id: "w3", name: "Printed Materials",           category: "Swag",     unitCost: "",    qtyType: "fixed",      qtyPer: ALL_CC, manualQty: "1000", costCenter: "Recruiting" },
  ];
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function parse(s: string): number {
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

const inputStyle: React.CSSProperties = {
  color: "var(--color-off-black)",
  background: "var(--color-off-white)",
  border: "1px solid var(--color-light-gray)",
  borderRadius: "var(--radius-sm)",
};
function focusBlue(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.target.style.borderColor = "var(--color-applied-blue)";
}
function blurGray(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.target.style.borderColor = "var(--color-light-gray)";
}

const COL = "8px 1fr 105px 125px 180px 65px 105px 135px 28px";

// ── Multi-select dropdown for Qty Basis ───────────────────────────────────────
function QtyBasisSelect({
  item,
  onPatch,
}: {
  item: LineItem;
  onPatch: (patch: Partial<LineItem>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isFixed  = item.qtyType === "fixed";
  const selected = item.qtyPer;
  const isAll    = selected.length === COST_CENTERS.length;
  const isSome   = selected.length > 0 && !isAll;

  function toggleAll() {
    onPatch({ qtyType: "per-person", qtyPer: isAll ? [] : [...COST_CENTERS] });
  }
  function toggleCC(cc: CostCenter) {
    const next = selected.includes(cc)
      ? selected.filter(c => c !== cc)
      : [...selected, cc];
    onPatch({ qtyType: "per-person", qtyPer: next });
  }
  function setFixed() {
    onPatch({ qtyType: "fixed" });
    setOpen(false);
  }

  // Button label
  const label = isFixed
    ? "Fixed qty"
    : selected.length === 0
    ? "None"
    : isAll
    ? "All attendees"
    : selected.length === 1
    ? selected[0]
    : `${selected.length} groups`;

  return (
    <div ref={ref} className="relative" style={{ width: "100%" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-sm px-2 py-1.5 focus:outline-none"
        style={{
          ...inputStyle,
          color: isFixed ? "var(--color-gray)" : "var(--color-off-black)",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span className="truncate">{label}</span>
        <svg
          className="w-3 h-3 flex-shrink-0 ml-1"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", color: "var(--color-gray)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-30 left-0 mt-1 py-1"
          style={{
            minWidth: "100%",
            background: "var(--color-white)",
            border: "1px solid var(--color-light-gray)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          {/* Per-person section header */}
          <div className="px-3 pt-1 pb-0.5">
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-gray)" }}>
              Per person
            </span>
          </div>

          {/* All */}
          <label
            className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
            style={{ background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-off-white)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <input
              type="checkbox"
              checked={!isFixed && isAll}
              ref={el => { if (el) el.indeterminate = !isFixed && isSome; }}
              onChange={toggleAll}
              style={{ accentColor: "var(--color-applied-blue)", cursor: "pointer" }}
            />
            <span className="text-sm" style={{ color: "var(--color-off-black)" }}>All attendees</span>
          </label>

          {/* Individual cost centers */}
          {COST_CENTERS.map(cc => (
            <label
              key={cc}
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
              style={{ background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-off-white)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <input
                type="checkbox"
                checked={!isFixed && selected.includes(cc)}
                onChange={() => toggleCC(cc)}
                style={{ accentColor: "var(--color-applied-blue)", cursor: "pointer" }}
              />
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: COST_CENTER_COLORS[cc] }} />
              <span className="text-sm" style={{ color: "var(--color-off-black)" }}>{cc}</span>
            </label>
          ))}

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--color-light-gray)", margin: "4px 8px" }} />

          {/* Fixed qty */}
          <label
            className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
            style={{ background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-off-white)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <input
              type="radio"
              checked={isFixed}
              onChange={setFixed}
              style={{ accentColor: "var(--color-applied-blue)", cursor: "pointer" }}
            />
            <span className="text-sm" style={{ color: "var(--color-off-black)" }}>Fixed quantity</span>
          </label>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [attendees, setAttendees] = useState<Record<CostCenter, number>>({
    Marketing: 2, Recruiting: 1, Operations: 3, Executive: 1,
  });
  const [items, setItems] = useState<LineItem[]>(buildDefaults);
  const [showImport, setShowImport] = useState(false);
  const [requestToken, setRequestToken] = useState("");

  useEffect(() => {
    fetch("/api/session")
      .then(r => r.json())
      .then(d => setRequestToken(d.requestToken ?? ""))
      .catch(() => {});
  }, []);

  const totalAttendees = COST_CENTERS.reduce((s, cc) => s + attendees[cc], 0);

  function getQty(item: LineItem): number {
    if (item.qtyType === "fixed") return parse(item.manualQty);
    return item.qtyPer.reduce((s, cc) => s + attendees[cc], 0);
  }
  function getTotal(item: LineItem): number {
    return parse(item.unitCost) * getQty(item);
  }

  const grandTotal = items.reduce((s, i) => s + getTotal(i), 0);
  const categoryTotals = Object.fromEntries(
    CATEGORIES.map(cat => [cat, items.filter(i => i.category === cat).reduce((s, i) => s + getTotal(i), 0)])
  ) as Record<CategoryName, number>;
  const costCenterTotals = Object.fromEntries(
    COST_CENTERS.map(cc => [cc, items.filter(i => i.costCenter === cc).reduce((s, i) => s + getTotal(i), 0)])
  ) as Record<CostCenter, number>;

  function patchItem(id: string, patch: Partial<LineItem>) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  }

  function addItem() {
    setItems(prev => [...prev, {
      id: genId(), name: "", category: "Venue", unitCost: "",
      qtyType: "fixed", qtyPer: [...COST_CENTERS], manualQty: "1", costCenter: "Operations",
    }]);
  }

  function handleImport(imported: ImportedItem[]) {
    setItems(prev => [
      ...prev,
      ...imported.map(i => ({
        id: genId(), name: i.name, category: i.category,
        unitCost: String(i.amount), qtyType: "fixed" as const,
        qtyPer: [...COST_CENTERS] as CostCenter[], manualQty: "1", costCenter: i.costCenter,
      })),
    ]);
    setShowImport(false);
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
    letterSpacing: "0.06em", color: "var(--color-gray)",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-off-white)" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-10" style={{ background: "var(--color-white)", borderBottom: "1px solid var(--color-light-gray)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1
              className="text-base font-semibold"
              style={{ color: "var(--color-off-black)", letterSpacing: "var(--tracking-mid)", fontFamily: '"Applied Sans Display", ui-sans-serif, system-ui, sans-serif' }}
            >
              Conference Budget Calculator
            </h1>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
              style={{ color: "var(--color-gray)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", background: "var(--color-white)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--color-off-black)"; e.currentTarget.style.borderColor = "var(--color-gray)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--color-gray)"; e.currentTarget.style.borderColor = "var(--color-light-gray)"; }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import from Sheets
            </button>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium uppercase mb-0.5" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Total Budget</div>
            <div
              className="text-2xl font-semibold tabular-nums"
              style={{ color: "var(--color-off-black)", letterSpacing: "var(--tracking-tight)", fontFamily: '"Applied Sans Display", ui-sans-serif, system-ui, sans-serif' }}
            >
              {fmt(grandTotal)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── Attendees panel ── */}
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", padding: "1rem 1.5rem" }}>
          <div className="flex items-center gap-6 flex-wrap">
            <span style={{ ...labelStyle, whiteSpace: "nowrap" }}>Attendees</span>
            <div className="flex items-center gap-5 flex-wrap flex-1">
              {COST_CENTERS.map(cc => (
                <div key={cc} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: COST_CENTER_COLORS[cc] }} />
                  <span className="text-xs" style={{ color: "var(--color-dark-gray)" }}>{cc}</span>
                  <input
                    type="number" min="0" value={attendees[cc]}
                    onChange={e => setAttendees(prev => ({ ...prev, [cc]: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="text-sm tabular-nums text-center focus:outline-none"
                    style={{ ...inputStyle, width: "44px", padding: "2px 4px" }}
                    onFocus={focusBlue} onBlur={blurGray}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span style={labelStyle}>Total</span>
              <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-off-black)" }}>{totalAttendees}</span>
            </div>
          </div>
        </div>

        {/* ── Budget table ── */}
        <div style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>

          {/* Column headers */}
          <div
            className="grid items-center px-4 py-2.5"
            style={{ gridTemplateColumns: COL, gap: "10px", borderBottom: "1px solid var(--color-light-gray)", background: "var(--color-off-white)" }}
          >
            <span />
            <span style={labelStyle}>Item</span>
            <span style={labelStyle}>Category</span>
            <span style={labelStyle}>Unit Cost</span>
            <span style={labelStyle}>Qty Basis</span>
            <span style={{ ...labelStyle, textAlign: "right" }}>Qty</span>
            <span style={{ ...labelStyle, textAlign: "right" }}>Total</span>
            <span style={labelStyle}>Cost Center</span>
            <span />
          </div>

          {/* Rows */}
          {items.map((item, idx) => {
            const qty   = getQty(item);
            const total = getTotal(item);
            return (
              <div
                key={item.id}
                className="grid items-center px-4 py-2"
                style={{ gridTemplateColumns: COL, gap: "10px", borderTop: idx === 0 ? "none" : "1px solid var(--color-light-gray)" }}
              >
                {/* Category accent bar */}
                <span style={{ display: "block", width: "3px", height: "28px", borderRadius: "2px", background: CATEGORY_COLORS[item.category], flexShrink: 0 }} />

                {/* Name */}
                <input
                  type="text" value={item.name}
                  onChange={e => patchItem(item.id, { name: e.target.value })}
                  placeholder="Line item description"
                  className="text-sm w-full bg-transparent border-0 border-b focus:outline-none py-0.5"
                  style={{ color: "var(--color-off-black)", borderColor: "transparent", caretColor: "var(--color-applied-blue)" }}
                  onFocus={e => (e.target.style.borderColor = "var(--color-light-gray)")}
                  onBlur={e => (e.target.style.borderColor = "transparent")}
                />

                {/* Category */}
                <select
                  value={item.category}
                  onChange={e => patchItem(item.id, { category: e.target.value as CategoryName })}
                  className="text-sm px-2 py-1.5 focus:outline-none cursor-pointer"
                  style={{ ...inputStyle, width: "100%" }}
                  onFocus={focusBlue} onBlur={blurGray}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
                </select>

                {/* Unit cost */}
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none" style={{ color: "var(--color-gray)" }}>$</span>
                  <input
                    type="number" value={item.unitCost}
                    onChange={e => patchItem(item.id, { unitCost: e.target.value })}
                    placeholder="0" min="0"
                    className="w-full text-sm pl-5 pr-2 py-1.5 tabular-nums focus:outline-none"
                    style={inputStyle}
                    onFocus={focusBlue} onBlur={blurGray}
                  />
                </div>

                {/* Qty basis — custom multi-select */}
                <QtyBasisSelect item={item} onPatch={patch => patchItem(item.id, patch)} />

                {/* Qty */}
                {item.qtyType === "fixed" ? (
                  <input
                    type="number" value={item.manualQty}
                    onChange={e => patchItem(item.id, { manualQty: e.target.value })}
                    placeholder="1" min="0"
                    className="w-full text-sm px-2 py-1.5 tabular-nums text-right focus:outline-none"
                    style={inputStyle}
                    onFocus={focusBlue} onBlur={blurGray}
                  />
                ) : (
                  <div
                    className="text-sm tabular-nums text-right px-2 py-1.5"
                    style={{ color: "var(--color-mid-grey)" }}
                    title={`Auto: ${item.qtyPer.length === COST_CENTERS.length ? "all attendees" : item.qtyPer.join(" + ")}`}
                  >
                    {qty}
                  </div>
                )}

                {/* Total */}
                <div
                  className="text-sm tabular-nums text-right font-medium"
                  style={{ color: total > 0 ? "var(--color-off-black)" : "var(--color-light-gray)" }}
                >
                  {total > 0 ? fmt(total) : "—"}
                </div>

                {/* Cost center */}
                <select
                  value={item.costCenter}
                  onChange={e => patchItem(item.id, { costCenter: e.target.value as CostCenter })}
                  className="text-sm px-2 py-1.5 focus:outline-none cursor-pointer"
                  style={{ ...inputStyle, width: "100%" }}
                  onFocus={focusBlue} onBlur={blurGray}
                >
                  {COST_CENTERS.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                </select>

                {/* Delete */}
                <button
                  onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                  className="flex items-center justify-center w-6 h-6"
                  style={{ color: "var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                  aria-label="Remove"
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--color-deep-grey)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--color-light-gray)")}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          {/* Grand total row */}
          <div
            className="grid items-center px-4 py-3"
            style={{ gridTemplateColumns: COL, gap: "10px", borderTop: "2px solid var(--color-light-gray)", background: "var(--color-off-white)" }}
          >
            <span /><span /><span /><span />
            <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Grand Total</span>
            <span />
            <span className="text-sm font-semibold tabular-nums text-right" style={{ color: "var(--color-off-black)" }}>{fmt(grandTotal)}</span>
            <span /><span />
          </div>

          {/* Add item */}
          <div className="px-4 py-3" style={{ borderTop: "1px solid var(--color-light-gray)" }}>
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "var(--color-gray)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-applied-blue)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-gray)")}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add line item
            </button>
          </div>
        </div>

        {/* ── Category legend ── */}
        <div className="flex items-center gap-5 flex-wrap px-1">
          {CATEGORIES.map(cat => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[cat] }} />
              <span className="text-xs" style={{ color: "var(--color-dark-gray)" }}>{CATEGORY_ICONS[cat]} {cat}</span>
            </div>
          ))}
        </div>

        {/* ── Breakdown panels ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
            <h2 className="text-xs font-semibold uppercase mb-5" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>By Category</h2>
            <div className="space-y-4">
              {CATEGORIES.map(cat => {
                const pct = grandTotal > 0 ? (categoryTotals[cat] / grandTotal) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2" style={{ color: "var(--color-dark-gray)" }}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[cat] }} />{cat}
                      </span>
                      <span className="tabular-nums" style={{ color: "var(--color-off-black)" }}>
                        {fmt(categoryTotals[cat])}
                        <span className="ml-2 text-xs" style={{ color: "var(--color-gray)" }}>{pct.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--color-off-white)" }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 flex justify-between text-sm font-semibold" style={{ borderTop: "1px solid var(--color-light-gray)", color: "var(--color-off-black)" }}>
                <span>Total</span><span className="tabular-nums">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
            <h2 className="text-xs font-semibold uppercase mb-5" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>By Cost Center</h2>
            <div className="space-y-4">
              {COST_CENTERS.map(cc => {
                const pct = grandTotal > 0 ? (costCenterTotals[cc] / grandTotal) * 100 : 0;
                return (
                  <div key={cc}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2" style={{ color: "var(--color-dark-gray)" }}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COST_CENTER_COLORS[cc] }} />{cc}
                      </span>
                      <span className="tabular-nums" style={{ color: "var(--color-off-black)" }}>
                        {fmt(costCenterTotals[cc])}
                        <span className="ml-2 text-xs" style={{ color: "var(--color-gray)" }}>{pct.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--color-off-white)" }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: COST_CENTER_COLORS[cc] }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 flex justify-between text-sm font-semibold" style={{ borderTop: "1px solid var(--color-light-gray)", color: "var(--color-off-black)" }}>
                <span>Total</span><span className="tabular-nums">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImport && (
        <ImportFromSheets requestToken={requestToken} onImport={handleImport} onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}
