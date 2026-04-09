"use client";

import { useState } from "react";
import type { Conference, Attendee, AttendeeConfirmed, TShirtSize } from "@/lib/types";
import { genId } from "@/lib/defaults";
import PeopleSearch from "./PeopleSearch";

interface Props {
  conference: Conference;
  update: (updates: Partial<Conference>) => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function AttendeesTab({ conference: conf, update }: Props) {
  const [showSearch, setShowSearch] = useState(false);
  const attendees = conf.attendees;

  function updateAttendees(newAttendees: Attendee[]) {
    update({ attendees: newAttendees });
  }

  function updateAttendee(id: string, field: keyof Attendee, value: unknown) {
    updateAttendees(
      attendees.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  }

  function addAttendee() {
    updateAttendees([
      ...attendees,
      {
        id: genId("att"),
        name: "",
        team: "",
        dates: "",
        hotelNights: 0,
        confirmed: "checking",
        ieeeMemberNumber: "",
        tshirtSize: "",
        foodPreference: "",
        conferenceRegistered: false,
        conferenceConfirmationNumber: "",
        hotelBooked: false,
        hotelBookingNote: "",
        hotelConfirmationNumber: "",
        hotelTotalCost: 0,
        flightsBooked: false,
        flightTotalCost: 0,
        flightInfoOutbound: "",
        flightInfoReturn: "",
        notes: "",
      },
    ]);
  }

  function removeAttendee(id: string) {
    updateAttendees(attendees.filter((a) => a.id !== id));
  }

  function addFromAnaheim(person: { name: string; email: string; phone: string; team: string }) {
    updateAttendees([
      ...attendees,
      {
        id: genId("att"),
        name: person.name,
        team: person.team,
        dates: "",
        hotelNights: 0,
        confirmed: "checking",
        ieeeMemberNumber: "",
        tshirtSize: "",
        foodPreference: "",
        conferenceRegistered: false,
        conferenceConfirmationNumber: "",
        hotelBooked: false,
        hotelBookingNote: "",
        hotelConfirmationNumber: "",
        hotelTotalCost: 0,
        flightsBooked: false,
        flightTotalCost: 0,
        flightInfoOutbound: "",
        flightInfoReturn: "",
        notes: person.email ? `Email: ${person.email}` : "",
      },
    ]);
  }

  const confirmedCount = attendees.filter((a) => a.confirmed === "confirmed").length;
  const totalHotelCost = attendees.reduce((s, a) => s + a.hotelTotalCost, 0);
  const totalFlightCost = attendees.reduce((s, a) => s + a.flightTotalCost, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)" }}>
          <span style={{ color: "var(--color-gray)" }}>Total: </span>
          <span className="font-medium" style={{ color: "var(--color-off-black)" }}>{attendees.length}</span>
        </div>
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)" }}>
          <span style={{ color: "var(--color-gray)" }}>Confirmed: </span>
          <span className="font-medium" style={{ color: "#2E7D32" }}>{confirmedCount}</span>
          <span style={{ color: "var(--color-gray)" }}> / Checking: </span>
          <span className="font-medium" style={{ color: "#F57F17" }}>{attendees.length - confirmedCount}</span>
        </div>
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)" }}>
          <span style={{ color: "var(--color-gray)" }}>Hotels: </span>
          <span className="font-medium tabular-nums" style={{ color: "var(--color-off-black)" }}>{fmt(totalHotelCost)}</span>
        </div>
        <div className="text-xs px-3 py-1.5 rounded" style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)" }}>
          <span style={{ color: "var(--color-gray)" }}>Flights: </span>
          <span className="font-medium tabular-nums" style={{ color: "var(--color-off-black)" }}>{fmt(totalFlightCost)}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowSearch(true)}
            className="text-xs font-medium px-3 py-1.5 text-white flex items-center gap-1.5"
            style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Anaheim
          </button>
          <button
            onClick={addAttendee}
            className="text-xs font-medium px-3 py-1.5"
            style={{ color: "var(--color-gray)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}
          >
            + Add Manually
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)" }}
      >
        <table className="w-full text-xs" style={{ minWidth: "1400px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
              {[
                "Name", "Team", "Dates", "Nights", "Confirmed?", "IEEE #",
                "T-Shirt", "Food Pref", "Registered?", "Conf #",
                "Hotel?", "Hotel #", "Hotel Cost", "Flights?", "Flight Cost",
                "Outbound", "Return", "Notes", ""
              ].map((h) => (
                <th
                  key={h}
                  className="px-2 py-2 text-left font-medium uppercase whitespace-nowrap"
                  style={{ color: "var(--color-gray)", letterSpacing: "0.06em" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendees.map((att) => (
              <tr key={att.id} style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.name} onChange={(e) => updateAttendee(att.id, "name", e.target.value)} className="w-full min-w-[100px] text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.team} onChange={(e) => updateAttendee(att.id, "team", e.target.value)} className="w-full min-w-[100px] text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.dates} onChange={(e) => updateAttendee(att.id, "dates", e.target.value)} className="w-full min-w-[80px] text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5">
                  <input type="number" value={att.hotelNights || ""} onChange={(e) => updateAttendee(att.id, "hotelNights", Number(e.target.value))} className="w-12 text-xs px-1 py-0.5 bg-transparent focus:outline-none tabular-nums" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" />
                </td>
                <td className="px-2 py-1.5">
                  <select value={att.confirmed} onChange={(e) => updateAttendee(att.id, "confirmed", e.target.value as AttendeeConfirmed)} className="text-xs px-1 py-0.5 focus:outline-none cursor-pointer font-medium" style={{ border: "none", borderRadius: "var(--radius-sm)", background: att.confirmed === "confirmed" ? "#E8F5E922" : "#FFF8E122", color: att.confirmed === "confirmed" ? "#2E7D32" : "#F57F17" }}>
                    <option value="checking">Checking</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.ieeeMemberNumber} onChange={(e) => updateAttendee(att.id, "ieeeMemberNumber", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5">
                  <select value={att.tshirtSize} onChange={(e) => updateAttendee(att.id, "tshirtSize", e.target.value as TShirtSize)} className="text-xs px-1 py-0.5 focus:outline-none cursor-pointer" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }}>
                    <option value="">--</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.foodPreference} onChange={(e) => updateAttendee(att.id, "foodPreference", e.target.value)} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} placeholder="N/A" />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input type="checkbox" checked={att.conferenceRegistered} onChange={(e) => updateAttendee(att.id, "conferenceRegistered", e.target.checked)} className="accent-[var(--color-applied-blue)]" />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.conferenceConfirmationNumber} onChange={(e) => updateAttendee(att.id, "conferenceConfirmationNumber", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input type="checkbox" checked={att.hotelBooked} onChange={(e) => updateAttendee(att.id, "hotelBooked", e.target.checked)} className="accent-[var(--color-applied-blue)]" />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.hotelConfirmationNumber} onChange={(e) => updateAttendee(att.id, "hotelConfirmationNumber", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5">
                  <input type="number" value={att.hotelTotalCost || ""} onChange={(e) => updateAttendee(att.id, "hotelTotalCost", Number(e.target.value))} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none tabular-nums" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" step="0.01" />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input type="checkbox" checked={att.flightsBooked} onChange={(e) => updateAttendee(att.id, "flightsBooked", e.target.checked)} className="accent-[var(--color-applied-blue)]" />
                </td>
                <td className="px-2 py-1.5">
                  <input type="number" value={att.flightTotalCost || ""} onChange={(e) => updateAttendee(att.id, "flightTotalCost", Number(e.target.value))} className="w-20 text-xs px-1 py-0.5 bg-transparent focus:outline-none tabular-nums" style={{ border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-sm)" }} min="0" step="0.01" />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.flightInfoOutbound} onChange={(e) => updateAttendee(att.id, "flightInfoOutbound", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} placeholder="SFO > DEN" />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.flightInfoReturn} onChange={(e) => updateAttendee(att.id, "flightInfoReturn", e.target.value)} className="w-24 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} placeholder="DEN > SFO" />
                </td>
                <td className="px-2 py-1.5">
                  <input type="text" value={att.notes} onChange={(e) => updateAttendee(att.id, "notes", e.target.value)} className="w-32 text-xs px-1 py-0.5 bg-transparent focus:outline-none" style={{ border: "1px solid transparent", borderRadius: "var(--radius-sm)" }} onFocus={(e) => (e.target.style.borderColor = "var(--color-light-gray)")} onBlur={(e) => (e.target.style.borderColor = "transparent")} />
                </td>
                <td className="px-2 py-1.5">
                  <button
                    onClick={() => removeAttendee(att.id)}
                    className="text-xs"
                    style={{ color: "var(--color-light-gray)" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-light-gray)")}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs mb-3" style={{ color: "var(--color-gray)" }}>No attendees yet.</p>
            <button
              onClick={() => setShowSearch(true)}
              className="text-xs font-medium px-4 py-2 text-white"
              style={{ background: "var(--color-applied-blue)", borderRadius: "var(--radius-sm)" }}
            >
              Search Anaheim to add attendees
            </button>
          </div>
        )}
      </div>

      {showSearch && (
        <PeopleSearch
          onSelect={addFromAnaheim}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}
