"use client";

import type { Conference, Booth, BoothShiftDay, BoothShiftSlot, DesignStatus, ShippingStatus } from "@/lib/types";
import { createDefaultBooth } from "@/lib/defaults";
import StatusBadge from "./StatusBadge";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

const DESIGN_STEPS: DesignStatus[] = ["not_started", "in_progress", "review", "approved", "submitted"];
const DESIGN_LABELS: Record<DesignStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  review: "In Review",
  approved: "Approved",
  submitted: "Submitted to Vendor",
};

export default function BoothTab({ conference: conf, update }: Props) {
  if (!conf.hasBooth) {
    return (
      <div className="text-center py-20">
        <p className="text-sm mb-4" style={{ color: "var(--color-gray)" }}>No booth for this conference.</p>
        <button
          onClick={() => update({ hasBooth: true, booth: createDefaultBooth() })}
          className="px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
        >
          + Add Booth
        </button>
      </div>
    );
  }

  const booth = conf.booth;

  function updateBooth(updates: Partial<Booth>) {
    update({ booth: { ...booth, ...updates } });
  }

  function updateShifts(newShifts: BoothShiftDay[]) {
    updateBooth({ shifts: newShifts });
  }

  function addDay() {
    updateShifts([
      ...booth.shifts,
      {
        date: "",
        slots: [
          { time: "10:00 AM - 12:30 PM", isSpecialEvent: false, specialEventLabel: "", boothers: ["", "", "", ""] },
          { time: "12:30 PM - 3:00 PM", isSpecialEvent: false, specialEventLabel: "", boothers: ["", "", "", ""] },
          { time: "3:00 PM - 5:30 PM", isSpecialEvent: false, specialEventLabel: "", boothers: ["", "", "", ""] },
        ],
      },
    ]);
  }

  function removeDay(idx: number) {
    updateShifts(booth.shifts.filter((_, i) => i !== idx));
  }

  function updateDay(idx: number, updates: Partial<BoothShiftDay>) {
    updateShifts(booth.shifts.map((d, i) => (i === idx ? { ...d, ...updates } : d)));
  }

  function addSlot(dayIdx: number) {
    const day = booth.shifts[dayIdx];
    updateDay(dayIdx, {
      slots: [...day.slots, { time: "", isSpecialEvent: false, specialEventLabel: "", boothers: ["", "", "", ""] }],
    });
  }

  function removeSlot(dayIdx: number, slotIdx: number) {
    const day = booth.shifts[dayIdx];
    updateDay(dayIdx, { slots: day.slots.filter((_, i) => i !== slotIdx) });
  }

  function updateSlot(dayIdx: number, slotIdx: number, updates: Partial<BoothShiftSlot>) {
    const day = booth.shifts[dayIdx];
    updateDay(dayIdx, {
      slots: day.slots.map((s, i) => (i === slotIdx ? { ...s, ...updates } : s)),
    });
  }

  function updateBoother(dayIdx: number, slotIdx: number, bootherIdx: number, value: string) {
    const slot = booth.shifts[dayIdx].slots[slotIdx];
    const newBoothers = [...slot.boothers];
    newBoothers[bootherIdx] = value;
    updateSlot(dayIdx, slotIdx, { boothers: newBoothers });
  }

  const attendeeNames = conf.attendees.map((a) => a.name).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Booth details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
          <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Booth Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Size</label>
              <input type="text" value={booth.size} onChange={(e) => updateBooth({ size: e.target.value })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} placeholder="e.g. 10x10" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Design Status</label>
              <div className="flex items-center gap-1 flex-wrap">
                {DESIGN_STEPS.map((step) => (
                  <button
                    key={step}
                    onClick={() => updateBooth({ design: { ...booth.design, status: step } })}
                    className="text-xs px-2 py-1 font-medium transition-colors"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      background: booth.design.status === step ? "var(--color-applied-blue)" : "var(--color-off-white)",
                      color: booth.design.status === step ? "white" : "var(--color-gray)",
                    }}
                  >
                    {DESIGN_LABELS[step]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Design Deadline</label>
              <input type="date" value={booth.design.deadline} onChange={(e) => updateBooth({ design: { ...booth.design, deadline: e.target.value } })} className="text-sm px-3 py-1.5 focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Design Notes</label>
              <textarea value={booth.design.notes} onChange={(e) => updateBooth({ design: { ...booth.design, notes: e.target.value } })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} rows={2} />
            </div>
          </div>
        </div>

        <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
          <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>Shipping & Freight</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Status</label>
              <select value={booth.shipping.status} onChange={(e) => updateBooth({ shipping: { ...booth.shipping, status: e.target.value as ShippingStatus } })} className="text-sm px-3 py-1.5 focus:outline-none cursor-pointer" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}>
                <option value="not_started">Not Started</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <span className="ml-2"><StatusBadge status={booth.shipping.status} /></span>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Carrier</label>
              <input type="text" value={booth.shipping.carrier} onChange={(e) => updateBooth({ shipping: { ...booth.shipping, carrier: e.target.value } })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Tracking #</label>
              <input type="text" value={booth.shipping.tracking} onChange={(e) => updateBooth({ shipping: { ...booth.shipping, tracking: e.target.value } })} className="text-sm px-3 py-1.5 w-full focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-gray)" }}>Deadline</label>
              <input type="date" value={booth.shipping.deadline} onChange={(e) => updateBooth({ shipping: { ...booth.shipping, deadline: e.target.value } })} className="text-sm px-3 py-1.5 focus:outline-none" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Materials checklist */}
      <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
          Materials Checklist ({booth.materials.filter((m) => m.packed).length}/{booth.materials.length} packed)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {booth.materials.map((mat, idx) => (
            <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer py-1" style={{ color: mat.packed ? "#4CAF50" : "var(--color-off-black)" }}>
              <input
                type="checkbox"
                checked={mat.packed}
                onChange={(e) => {
                  const newMats = [...booth.materials];
                  newMats[idx] = { ...mat, packed: e.target.checked };
                  updateBooth({ materials: newMats });
                }}
                className="accent-[#4CAF50]"
              />
              <span style={{ textDecoration: mat.packed ? "line-through" : "none" }}>{mat.item}</span>
            </label>
          ))}
        </div>
        <button
          onClick={() => updateBooth({ materials: [...booth.materials, { item: "", packed: false }] })}
          className="mt-3 text-xs"
          style={{ color: "var(--color-gray)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-applied-blue)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gray)")}
        >
          + Add item
        </button>
      </div>

      {/* Booth shifts schedule */}
      <div className="p-5" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}>
            Booth Shifts Schedule
          </h3>
          <button
            onClick={addDay}
            className="text-xs font-medium px-3 py-1.5"
            style={{ color: "var(--color-applied-blue)", border: "1px solid var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
          >
            + Add Day
          </button>
        </div>

        {booth.shifts.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--color-gray)" }}>No shifts scheduled. Add a day to get started.</p>
        ) : (
          <div className="space-y-6">
            {booth.shifts.map((day, dayIdx) => (
              <div key={dayIdx}>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={day.date}
                    onChange={(e) => updateDay(dayIdx, { date: e.target.value })}
                    placeholder="e.g. Tuesday, October 21st"
                    className="text-sm font-medium px-2 py-1 focus:outline-none"
                    style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)", color: "var(--color-off-black)" }}
                  />
                  <button onClick={() => addSlot(dayIdx)} className="text-xs" style={{ color: "var(--color-applied-blue)" }}>+ Slot</button>
                  <button onClick={() => removeDay(dayIdx)} className="text-xs ml-auto" style={{ color: "var(--color-light-gray)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}>Remove Day</button>
                </div>
                <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)", width: "160px" }}>Time Slot</th>
                      <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Boother 1</th>
                      <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Boother 2</th>
                      <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Boother 3</th>
                      <th className="px-2 py-1 text-left font-medium" style={{ color: "var(--color-gray)" }}>Boother 4</th>
                      <th className="px-2 py-1" style={{ width: "60px" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {day.slots.map((slot, slotIdx) => (
                      <tr
                        key={slotIdx}
                        style={{
                          borderTop: "1px solid var(--color-light-gray)",
                          background: slot.isSpecialEvent ? "#FFF8E1" : "transparent",
                        }}
                      >
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-1">
                            {slot.isSpecialEvent && (
                              <span className="text-xs font-bold" style={{ color: "#E65100" }}>
                                {slot.specialEventLabel || "EVENT"}
                              </span>
                            )}
                            <input
                              type="text"
                              value={slot.time}
                              onChange={(e) => updateSlot(dayIdx, slotIdx, { time: e.target.value })}
                              placeholder="10:00 AM - 12:30 PM"
                              className="w-full text-xs px-1 py-0.5 bg-transparent focus:outline-none"
                              style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }}
                              onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")}
                              onBlur={(e) => (e.target.style.borderColor = "transparent")}
                            />
                          </div>
                        </td>
                        {[0, 1, 2, 3].map((bi) => (
                          <td key={bi} className="px-2 py-1.5">
                            <input
                              type="text"
                              value={slot.boothers[bi] || ""}
                              onChange={(e) => updateBoother(dayIdx, slotIdx, bi, e.target.value)}
                              placeholder="Name"
                              list={`attendee-list-${dayIdx}-${slotIdx}-${bi}`}
                              className="w-full text-xs px-1 py-0.5 bg-transparent focus:outline-none"
                              style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }}
                              onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")}
                              onBlur={(e) => (e.target.style.borderColor = "transparent")}
                            />
                            <datalist id={`attendee-list-${dayIdx}-${slotIdx}-${bi}`}>
                              {attendeeNames.map((n) => <option key={n} value={n} />)}
                            </datalist>
                          </td>
                        ))}
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-1">
                            <label className="cursor-pointer" title="Special event">
                              <input
                                type="checkbox"
                                checked={slot.isSpecialEvent}
                                onChange={(e) => updateSlot(dayIdx, slotIdx, { isSpecialEvent: e.target.checked })}
                                className="accent-[#E65100]"
                              />
                            </label>
                            <button onClick={() => removeSlot(dayIdx, slotIdx)} style={{ color: "var(--color-light-gray)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
