"use client";

import type { Conference, Budget, BudgetLineItem, BudgetSummaryItem, TeamSpendItem, BudgetHeadcount } from "@/lib/types";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function BudgetTab({ conference: conf, update }: Props) {
  const budget = conf.budget;

  function updateBudget(updates: Partial<Budget>) {
    update({ budget: { ...budget, ...updates } });
  }

  function updateHeadcount(field: keyof BudgetHeadcount, value: number) {
    const hc = { ...budget.headcount, [field]: value };
    hc.total = hc.recruiting + hc.research + hc.engineering + hc.marketing;
    updateBudget({ headcount: hc });
  }

  function updateLineItem(idx: number, field: keyof BudgetLineItem, value: unknown) {
    const items = [...budget.lineItems];
    items[idx] = { ...items[idx], [field]: value };
    if (field === "costPerUnit" || field === "quantity") {
      items[idx].totalCost = items[idx].costPerUnit * items[idx].quantity;
    }
    updateBudget({ lineItems: items });
  }

  function addLineItem() {
    updateBudget({
      lineItems: [...budget.lineItems, { dateOfSpend: "", item: "", source: "", costPerUnit: 0, quantity: 1, totalCost: 0, actualSpend: 0, notes: "" }],
    });
  }

  function removeLineItem(idx: number) {
    updateBudget({ lineItems: budget.lineItems.filter((_, i) => i !== idx) });
  }

  function updateSummaryItem(idx: number, field: keyof BudgetSummaryItem, value: unknown) {
    const items = [...budget.summary];
    items[idx] = { ...items[idx], [field]: value };
    updateBudget({ summary: items });
  }

  function updateTeamSpend(idx: number, field: keyof TeamSpendItem, value: unknown) {
    const items = [...budget.teamSpend];
    items[idx] = { ...items[idx], [field]: value };
    updateBudget({ teamSpend: items });
  }

  const totalProjected = budget.lineItems.reduce((s, li) => s + li.totalCost, 0);
  const totalActual = budget.lineItems.reduce((s, li) => s + li.actualSpend, 0);
  const grandTeamProjected = budget.teamSpend.reduce((s, ts) => s + ts.projectedCost, 0);

  return (
    <div className="space-y-6">
      {/* Headcount inputs */}
      <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Headcount</h3>
        <div className="flex items-center gap-6 flex-wrap">
          {(["recruiting", "research", "engineering", "marketing"] as const).map((dept) => (
            <div key={dept} className="flex items-center gap-2">
              <label className="text-xs capitalize" style={{ color: "var(--color-gray)" }}>{dept}:</label>
              <input
                type="number"
                value={budget.headcount[dept] || ""}
                onChange={(e) => updateHeadcount(dept, Number(e.target.value))}
                className="w-14 text-sm px-2 py-1 tabular-nums focus:outline-none"
                style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
                min="0"
              />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: "var(--color-off-black)" }}>Total:</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-off-black)" }}>{budget.headcount.total}</span>
          </div>
        </div>
      </div>

      {/* Line items table */}
      <div style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
          <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
            Line Items
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "var(--color-gray)" }}>
              Projected: <span className="font-medium tabular-nums" style={{ color: "var(--color-off-black)" }}>{fmt(totalProjected)}</span>
            </span>
            <span className="text-xs" style={{ color: "var(--color-gray)" }}>
              Actual: <span className="font-medium tabular-nums" style={{ color: totalActual > totalProjected ? "#C62828" : "var(--color-off-black)" }}>{fmt(totalActual)}</span>
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: "1100px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                {["Date", "Item", "Source", "Cost/Unit", "Qty", "Total", "Actual", "Notes", ""].map((h) => (
                  <th key={h} className="px-2 py-2 text-left font-medium uppercase whitespace-nowrap" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budget.lineItems.map((li, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                  <td className="px-2 py-1.5"><input type="text" value={li.dateOfSpend} onChange={(e) => updateLineItem(idx, "dateOfSpend", e.target.value)} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} placeholder="MM/DD" /></td>
                  <td className="px-2 py-1.5"><input type="text" value={li.item} onChange={(e) => updateLineItem(idx, "item", e.target.value)} className="w-full min-w-[200px] text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                  <td className="px-2 py-1.5"><input type="text" value={li.source} onChange={(e) => updateLineItem(idx, "source", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                  <td className="px-2 py-1.5"><input type="number" value={li.costPerUnit || ""} onChange={(e) => updateLineItem(idx, "costPerUnit", Number(e.target.value))} className="w-20 text-xs px-1 py-0.5 tabular-nums focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" step="0.01" /></td>
                  <td className="px-2 py-1.5"><input type="number" value={li.quantity || ""} onChange={(e) => updateLineItem(idx, "quantity", Number(e.target.value))} className="w-14 text-xs px-1 py-0.5 tabular-nums focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" /></td>
                  <td className="px-2 py-1.5">
                    <input type="number" value={li.totalCost || ""} onChange={(e) => updateLineItem(idx, "totalCost", Number(e.target.value))} className="w-24 text-xs px-1 py-0.5 tabular-nums font-medium focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" step="0.01" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={li.actualSpend || ""}
                      onChange={(e) => updateLineItem(idx, "actualSpend", Number(e.target.value))}
                      className="w-24 text-xs px-1 py-0.5 tabular-nums focus:outline-none"
                      style={{
                        border: "1px solid var(--color-light-gray)",
                        borderRadius: "var(--radius-sm)",
                        color: li.actualSpend > li.totalCost && li.totalCost > 0 ? "#C62828" : li.actualSpend > 0 && li.actualSpend <= li.totalCost ? "#2E7D32" : "inherit",
                      }}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-2 py-1.5"><input type="text" value={li.notes} onChange={(e) => updateLineItem(idx, "notes", e.target.value)} className="w-40 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} /></td>
                  <td className="px-2 py-1.5">
                    <button onClick={() => removeLineItem(idx)} style={{ color: "var(--color-light-gray)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-2.5" style={{ borderTop: "1px solid var(--color-light-gray)" }}>
          <button onClick={addLineItem} className="flex items-center gap-1 text-xs" style={{ color: "var(--color-gray)" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-applied-blue)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gray)")}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add line item
          </button>
        </div>
      </div>

      {/* Summary + Team spend side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
          <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Category Summary</h3>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Category</th>
                <th className="px-2 py-1 text-right font-medium" style={{ color: "var(--color-gray)" }}>Projected</th>
                <th className="px-2 py-1 text-right font-medium" style={{ color: "var(--color-gray)" }}>Actual</th>
                <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {budget.summary.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                  <td className="px-2 py-1.5"><input type="text" value={s.category} onChange={(e) => updateSummaryItem(idx, "category", e.target.value)} className="w-full text-xs px-1 py-0.5 bg-transparent focus:outline-none font-medium" /></td>
                  <td className="px-2 py-1.5"><input type="number" value={s.projectedCost || ""} onChange={(e) => updateSummaryItem(idx, "projectedCost", Number(e.target.value))} className="w-24 text-xs px-1 py-0.5 tabular-nums text-right focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} /></td>
                  <td className="px-2 py-1.5"><input type="number" value={s.actualSpend || ""} onChange={(e) => updateSummaryItem(idx, "actualSpend", Number(e.target.value))} className="w-24 text-xs px-1 py-0.5 tabular-nums text-right focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} /></td>
                  <td className="px-2 py-1.5"><input type="text" value={s.notes} onChange={(e) => updateSummaryItem(idx, "notes", e.target.value)} className="w-full text-xs px-1 py-0.5 bg-transparent focus:outline-none" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Team spend */}
        <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
          <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Team Spend Breakdown</h3>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Owner</th>
                <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Label</th>
                <th className="px-2 py-1 text-right font-medium" style={{ color: "var(--color-gray)" }}>Projected</th>
                <th className="px-2 py-1 text-right font-medium" style={{ color: "var(--color-gray)" }}>Actual</th>
              </tr>
            </thead>
            <tbody>
              {budget.teamSpend.map((ts, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                  <td className="px-2 py-1.5"><input type="text" value={ts.owner} onChange={(e) => updateTeamSpend(idx, "owner", e.target.value)} className="w-28 text-xs px-1 py-0.5 bg-transparent focus:outline-none" /></td>
                  <td className="px-2 py-1.5"><input type="text" value={ts.label} onChange={(e) => updateTeamSpend(idx, "label", e.target.value)} className="w-full text-xs px-1 py-0.5 bg-transparent focus:outline-none font-medium" /></td>
                  <td className="px-2 py-1.5"><input type="number" value={ts.projectedCost || ""} onChange={(e) => updateTeamSpend(idx, "projectedCost", Number(e.target.value))} className="w-24 text-xs px-1 py-0.5 tabular-nums text-right focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} /></td>
                  <td className="px-2 py-1.5"><input type="number" value={ts.actualSpend || ""} onChange={(e) => updateTeamSpend(idx, "actualSpend", Number(e.target.value))} className="w-24 text-xs px-1 py-0.5 tabular-nums text-right focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} /></td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan={2} className="px-2 py-2 text-right" style={{ color: "var(--color-off-black)" }}>Grand Total</td>
                <td className="px-2 py-2 text-right tabular-nums" style={{ color: "var(--color-off-black)" }}>{fmt(grandTeamProjected)}</td>
                <td className="px-2 py-2 text-right tabular-nums" style={{ color: "var(--color-off-black)" }}>{fmt(budget.teamSpend.reduce((s, ts) => s + ts.actualSpend, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
