import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadConferences, saveConferences, exportData, importData } from "../lib/storage";
import { createDefaultConference } from "../lib/defaults";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("loadConferences", () => {
  it("returns empty array when no data stored", () => {
    expect(loadConferences()).toEqual([]);
  });

  it("returns parsed conferences from localStorage", () => {
    const conf = createDefaultConference("Test Conf");
    localStorageMock.setItem("conference-dri-hub-data", JSON.stringify([conf]));
    const result = loadConferences();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Conf");
  });

  it("returns empty array on corrupted JSON", () => {
    localStorageMock.setItem("conference-dri-hub-data", "not valid json{{{");
    expect(loadConferences()).toEqual([]);
  });
});

describe("saveConferences", () => {
  it("saves conferences to localStorage", () => {
    const conf = createDefaultConference("Save Test");
    saveConferences([conf]);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "conference-dri-hub-data",
      expect.any(String)
    );
    const stored = JSON.parse(localStorageMock.getItem("conference-dri-hub-data")!);
    expect(stored[0].name).toBe("Save Test");
  });

  it("overwrites existing data", () => {
    saveConferences([createDefaultConference("First")]);
    saveConferences([createDefaultConference("Second")]);
    const stored = JSON.parse(localStorageMock.getItem("conference-dri-hub-data")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("Second");
  });

  it("can save an empty array", () => {
    saveConferences([]);
    const stored = JSON.parse(localStorageMock.getItem("conference-dri-hub-data")!);
    expect(stored).toEqual([]);
  });
});

describe("exportData", () => {
  it("returns pretty-printed JSON of stored conferences", () => {
    const conf = createDefaultConference("Export Test");
    saveConferences([conf]);
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed[0].name).toBe("Export Test");
    // Verify it's pretty-printed (has newlines)
    expect(exported).toContain("\n");
  });

  it("returns empty array JSON when no data", () => {
    expect(exportData()).toBe("[]");
  });
});

describe("importData", () => {
  it("parses valid JSON and saves to localStorage", () => {
    const conf = createDefaultConference("Import Test");
    const json = JSON.stringify([conf]);
    const result = importData(json);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Import Test");
    // Should also be saved
    const stored = JSON.parse(localStorageMock.getItem("conference-dri-hub-data")!);
    expect(stored[0].name).toBe("Import Test");
  });

  it("throws on invalid JSON", () => {
    expect(() => importData("not json")).toThrow();
  });

  it("throws when data is not an array", () => {
    expect(() => importData('{"not": "an array"}')).toThrow("Invalid data format");
  });

  it("accepts an empty array", () => {
    const result = importData("[]");
    expect(result).toEqual([]);
  });
});

describe("round-trip", () => {
  it("save then load preserves conference data", () => {
    const conf = createDefaultConference("Round Trip");
    conf.location = "San Francisco, CA";
    conf.dates = "June 15-18, 2025";
    conf.status = "active";
    conf.attendees = [
      {
        id: "att-1",
        name: "Test Person",
        team: "Engineering",
        dates: "June 15-18",
        hotelNights: 3,
        confirmed: "confirmed",
        ieeeMemberNumber: "",
        tshirtSize: "L",
        foodPreference: "",
        conferenceRegistered: true,
        conferenceConfirmationNumber: "CONF-123",
        hotelBooked: true,
        hotelBookingNote: "",
        hotelConfirmationNumber: "HTL-456",
        hotelTotalCost: 900,
        flightsBooked: true,
        flightTotalCost: 450,
        flightInfoOutbound: "UA 100",
        flightInfoReturn: "UA 101",
        notes: "",
      },
    ];

    saveConferences([conf]);
    const loaded = loadConferences();

    expect(loaded[0].name).toBe("Round Trip");
    expect(loaded[0].location).toBe("San Francisco, CA");
    expect(loaded[0].status).toBe("active");
    expect(loaded[0].attendees[0].name).toBe("Test Person");
    expect(loaded[0].attendees[0].hotelTotalCost).toBe(900);
    expect(loaded[0].attendees[0].confirmed).toBe("confirmed");
  });

  it("export then import preserves data", () => {
    const conf = createDefaultConference("Export Import");
    conf.budget.headcount.recruiting = 3;
    conf.budget.lineItems[0].actualSpend = 500;
    saveConferences([conf]);

    const exported = exportData();
    localStorageMock.clear();
    const imported = importData(exported);

    expect(imported[0].name).toBe("Export Import");
    expect(imported[0].budget.headcount.recruiting).toBe(3);
    expect(imported[0].budget.lineItems[0].actualSpend).toBe(500);
  });
});
