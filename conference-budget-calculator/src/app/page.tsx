"use client";

import { useState, useEffect } from "react";
import ImportFromSheets, { type ImportedItem } from "./ImportFromSheets";

type CostCenter = "Marketing" | "Recruiting" | "Operations" | "Executive";
type CategoryName = "Venue" | "Catering" | "Speakers" | "Travel" | "Swag";

const COST_CENTERS: CostCenter[] = ["Marketing", "Recruiting", "Operations", "Executive"];

const CATEGORY_COLORS: Record<CategoryName, string> = {
  Venue:    "#006cfa",
  Catering: "#0891b2",
  Speakers: "#059669",
  Travel:   "#7c3aed",
  Swag:     "#e8198a",
};

const COST_CENTER_COLORS: Record<CostCenter, string> = {
  Marketing:  "#006cfa",
  Recruiting: "#059669",
  Operations: "#5a6072",
  Executive:  "#7c3aed",
};

interface LineItem {
  id: string;
  name: string;
  amount: string;
  costCenter: CostCenter;
}

type CategoriesState = Record<CategoryName, LineItem[]>;

const CATEGORIES: CategoryName[] = ["Venue", "Catering", "Speakers", "Travel", "Swag"];

let _id = 100;
const genId = () => String(++_id);

function buildDefaults(): CategoriesState {
  const defaults: Record<CategoryName, [string, CostCenter][]> = {
    Venue: [
      ["Venue Rental", "Operations"],
      ["AV Equipment", "Operations"],
      ["WiFi / Tech Setup", "Operations"],
    ],
    Catering: [
      ["Breakfast", "Operations"],
      ["Lunch", "Operations"],
      ["Coffee Breaks", "Operations"],
      ["Evening Reception", "Marketing"],
    ],
    Speakers: [
      ["Speaker Honoraria", "Marketing"],
      ["Speaker Travel", "Marketing"],
      ["Speaker Accommodation", "Marketing"],
    ],
    Travel: [
      ["Staff Flights", "Operations"],
      ["Staff Accommodation", "Operations"],
      ["Ground Transportation", "Operations"],
    ],
    Swag: [
      ["T-Shirts / Apparel", "Marketing"],
      ["Tote Bags", "Marketing"],
      ["Printed Materials", "Recruiting"],
    ],
  };
  return Object.fromEntries(
    CATEGORIES.map((cat) => [
      cat,
      defaults[cat].map(([name, costCenter], i) => ({
        id: `${cat[0]}${i}`,
        name,
        amount: "",
        costCenter,
      })),
    ])
  ) as CategoriesState;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function parse(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

const IRIDESCENT = "linear-gradient(90deg, #006cfa 0%, #00b8d4 17%, #00c896 33%, #f0c800 50%, #ff5e1a 67%, #e8198a 83%, #8b33ea 100%)";

export default function Home() {
  const [categories, setCategories] = useState<CategoriesState>(buildDefaults);
  const [collapsed, setCollapsed] = useState<Record<CategoryName, boolean>>(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, false])) as Record<CategoryName, boolean>
  );
  const [showImport, setShowImport] = useState(false);
  const [requestToken, setRequestToken] = useState("");

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => setRequestToken(d.requestToken ?? ""))
      .catch(() => {});
  }, []);

  function handleImport(items: ImportedItem[]) {
    setCategories((prev) => {
      const next = { ...prev };
      for (const item of items) {
        next[item.category] = [
          ...next[item.category],
          { id: genId(), name: item.name, amount: String(item.amount), costCenter: item.costCenter },
        ];
      }
      return next;
    });
    setShowImport(false);
  }

  const updateItem = (cat: CategoryName, id: string, field: keyof LineItem, value: string) =>
    setCategories((prev) => ({
      ...prev,
      [cat]: prev[cat].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));

  const addItem = (cat: CategoryName) =>
    setCategories((prev) => ({
      ...prev,
      [cat]: [...prev[cat], { id: genId(), name: "", amount: "", costCenter: "Operations" }],
    }));

  const removeItem = (cat: CategoryName, id: string) =>
    setCategories((prev) => ({
      ...prev,
      [cat]: prev[cat].filter((item) => item.id !== id),
    }));

  const toggleCollapse = (cat: CategoryName) =>
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const categoryTotals = Object.fromEntries(
    CATEGORIES.map((cat) => [cat, categories[cat].reduce((sum, item) => sum + parse(item.amount), 0)])
  ) as Record<CategoryName, number>;

  const grandTotal = CATEGORIES.reduce((sum, cat) => sum + categoryTotals[cat], 0);

  const costCenterTotals = Object.fromEntries(
    COST_CENTERS.map((cc) => [
      cc,
      CATEGORIES.flatMap((cat) => categories[cat])
        .filter((item) => item.costCenter === cc)
        .reduce((sum, item) => sum + parse(item.amount), 0),
    ])
  ) as Record<CostCenter, number>;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Nav bar */}
      <header
        className="sticky top-0 z-10"
        style={{ background: "var(--color-header)", position: "relative" }}
      >
        {/* Iridescent accent stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: IRIDESCENT,
          }}
        />

        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Applied Intuition wordmark */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt="Applied Intuition"
              style={{ height: "17px", width: "auto" }}
            />

            <span
              style={{
                width: "1px",
                height: "16px",
                background: "rgba(255,255,255,0.15)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />

            <span
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.01em" }}
            >
              Conference Budget Calculator
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import from Sheets
            </button>

            <div className="text-right">
              <div
                className="text-xs font-medium mb-0.5"
                style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Total Budget
              </div>
              <div
                className="text-xl font-semibold tabular-nums"
                style={{ color: "#ffffff", letterSpacing: "var(--tracking-tight)", fontFamily: "appliedSansDisplay, ui-sans-serif" }}
              >
                {fmt(grandTotal)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden", background: "#0d1117" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/header-1.png"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
            display: "block",
          }}
        />
        {/* Bottom fade into body bg */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to bottom, transparent, var(--color-bg))",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Category input sections */}
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                overflow: "hidden",
              }}
            >
              {/* Category header */}
              <button
                onClick={() => toggleCollapse(cat)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors"
                style={{ background: "transparent" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-raised)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                }
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CATEGORY_COLORS[cat] }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-off-black)" }}
                  >
                    {cat}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    {categories[cat].length} items
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: "var(--color-off-black)" }}
                  >
                    {fmt(categoryTotals[cat])}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed[cat] ? "" : "rotate-180"}`}
                    style={{ color: "var(--color-mid-gray)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Line items */}
              {!collapsed[cat] && (
                <div style={{ borderTop: "1px solid var(--color-light-gray)" }}>
                  {/* Column labels */}
                  <div
                    className="px-5 py-2 grid grid-cols-[1fr_160px_160px_28px] gap-3"
                    style={{
                      borderBottom: "1px solid var(--color-light-gray)",
                      background: "var(--color-surface-raised)",
                    }}
                  >
                    <span className="text-xs font-medium uppercase" style={{ color: "var(--color-mid-gray)", letterSpacing: "0.06em" }}>Description</span>
                    <span className="text-xs font-medium uppercase" style={{ color: "var(--color-mid-gray)", letterSpacing: "0.06em" }}>Amount</span>
                    <span className="text-xs font-medium uppercase" style={{ color: "var(--color-mid-gray)", letterSpacing: "0.06em" }}>Cost Center</span>
                    <span />
                  </div>

                  {categories[cat].map((item, idx) => (
                    <div
                      key={item.id}
                      className="px-5 py-2.5 grid grid-cols-[1fr_160px_160px_28px] gap-3 items-center"
                      style={{
                        borderTop: idx === 0 ? "none" : "1px solid var(--color-light-gray)",
                      }}
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(cat, item.id, "name", e.target.value)}
                        placeholder="Line item description"
                        className="text-sm w-full bg-transparent border-0 border-b focus:outline-none py-0.5 transition-colors"
                        style={{
                          color: "var(--color-off-black)",
                          borderColor: "transparent",
                          caretColor: "var(--color-applied-blue)",
                        }}
                        onFocus={(e) =>
                          ((e.target as HTMLInputElement).style.borderColor = "var(--color-light-gray)")
                        }
                        onBlur={(e) =>
                          ((e.target as HTMLInputElement).style.borderColor = "transparent")
                        }
                      />
                      <div className="relative">
                        <span
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm select-none"
                          style={{ color: "var(--color-mid-gray)" }}
                        >
                          $
                        </span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateItem(cat, item.id, "amount", e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full text-sm pl-6 pr-3 py-1.5 tabular-nums focus:outline-none transition-colors"
                          style={{
                            color: "var(--color-off-black)",
                            background: "var(--color-surface-raised)",
                            border: "1px solid var(--color-light-gray)",
                            borderRadius: "var(--radius-sm)",
                          }}
                          onFocus={(e) =>
                            ((e.target as HTMLInputElement).style.borderColor = "var(--color-applied-blue)")
                          }
                          onBlur={(e) =>
                            ((e.target as HTMLInputElement).style.borderColor = "var(--color-light-gray)")
                          }
                        />
                      </div>
                      <select
                        value={item.costCenter}
                        onChange={(e) => updateItem(cat, item.id, "costCenter", e.target.value as CostCenter)}
                        className="text-sm px-2 py-1.5 focus:outline-none transition-colors cursor-pointer"
                        style={{
                          color: "var(--color-off-black)",
                          background: "var(--color-surface-raised)",
                          border: "1px solid var(--color-light-gray)",
                          borderRadius: "var(--radius-sm)",
                        }}
                        onFocus={(e) =>
                          ((e.target as HTMLSelectElement).style.borderColor = "var(--color-applied-blue)")
                        }
                        onBlur={(e) =>
                          ((e.target as HTMLSelectElement).style.borderColor = "var(--color-light-gray)")
                        }
                      >
                        {COST_CENTERS.map((cc) => (
                          <option key={cc} value={cc}>{cc}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeItem(cat, item.id)}
                        className="flex items-center justify-center w-6 h-6 transition-colors"
                        style={{ color: "var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                        aria-label="Remove"
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color = "#e8198a")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-light-gray)")
                        }
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div
                    className="px-5 py-3"
                    style={{ borderTop: "1px solid var(--color-light-gray)" }}
                  >
                    <button
                      onClick={() => addItem(cat)}
                      className="flex items-center gap-1.5 text-sm transition-colors"
                      style={{ color: "var(--color-mid-gray)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-applied-blue)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-mid-gray)")
                      }
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add line item
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Breakdown panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By Category */}
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
              padding: "1.5rem",
            }}
          >
            <h2
              className="text-xs font-semibold uppercase mb-5"
              style={{ color: "var(--color-mid-gray)", letterSpacing: "0.08em" }}
            >
              By Category
            </h2>
            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const pct = grandTotal > 0 ? (categoryTotals[cat] / grandTotal) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="flex items-center gap-2" style={{ color: "var(--color-dark-gray)" }}>
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: CATEGORY_COLORS[cat] }}
                        />
                        {cat}
                      </span>
                      <span className="tabular-nums" style={{ color: "var(--color-off-black)" }}>
                        {fmt(categoryTotals[cat])}
                        <span className="ml-2 text-xs" style={{ color: "var(--color-mid-gray)" }}>
                          {pct.toFixed(0)}%
                        </span>
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "var(--color-light-gray)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: IRIDESCENT }}
                      />
                    </div>
                  </div>
                );
              })}
              <div
                className="pt-3 flex justify-between text-sm font-semibold"
                style={{
                  borderTop: "1px solid var(--color-light-gray)",
                  color: "var(--color-off-black)",
                }}
              >
                <span>Total</span>
                <span className="tabular-nums">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* By Cost Center */}
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
              padding: "1.5rem",
            }}
          >
            <h2
              className="text-xs font-semibold uppercase mb-5"
              style={{ color: "var(--color-mid-gray)", letterSpacing: "0.08em" }}
            >
              By Cost Center
            </h2>
            <div className="space-y-4">
              {COST_CENTERS.map((cc) => {
                const pct = grandTotal > 0 ? (costCenterTotals[cc] / grandTotal) * 100 : 0;
                return (
                  <div key={cc}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="flex items-center gap-2" style={{ color: "var(--color-dark-gray)" }}>
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: COST_CENTER_COLORS[cc] }}
                        />
                        {cc}
                      </span>
                      <span className="tabular-nums" style={{ color: "var(--color-off-black)" }}>
                        {fmt(costCenterTotals[cc])}
                        <span className="ml-2 text-xs" style={{ color: "var(--color-mid-gray)" }}>
                          {pct.toFixed(0)}%
                        </span>
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "var(--color-light-gray)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: IRIDESCENT }}
                      />
                    </div>
                  </div>
                );
              })}
              <div
                className="pt-3 flex justify-between text-sm font-semibold"
                style={{
                  borderTop: "1px solid var(--color-light-gray)",
                  color: "var(--color-off-black)",
                }}
              >
                <span>Total</span>
                <span className="tabular-nums">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImport && (
        <ImportFromSheets
          requestToken={requestToken}
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
