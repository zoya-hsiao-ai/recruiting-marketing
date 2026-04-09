import { describe, it, expect } from "vitest";
import {
  genId,
  createDefaultConference,
  createDefaultBooth,
  createDefaultBudget,
  createDefaultPrivateEvent,
  createDefaultStrategy,
  DEFAULT_ACTION_ITEMS,
  DEFAULT_BUDGET_LINE_ITEMS,
  DEFAULT_BOOTH_MATERIALS,
} from "../lib/defaults";

describe("genId", () => {
  it("generates unique IDs on successive calls", () => {
    const a = genId();
    const b = genId();
    expect(a).not.toBe(b);
  });

  it("uses the provided prefix", () => {
    const id = genId("conf");
    expect(id).toMatch(/^conf-/);
  });

  it("defaults to 'id' prefix when none given", () => {
    const id = genId();
    expect(id).toMatch(/^id-/);
  });

  it("includes a timestamp component", () => {
    const before = Date.now();
    const id = genId("test");
    const after = Date.now();
    // Extract the timestamp part: prefix-<timestamp>-<counter>
    const parts = id.split("-");
    const ts = parseInt(parts[1], 10);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});

describe("createDefaultConference", () => {
  it("creates a conference with the given name", () => {
    const conf = createDefaultConference("CVPR 2025");
    expect(conf.name).toBe("CVPR 2025");
  });

  it("generates a slug-based ID from the name", () => {
    const conf = createDefaultConference("CVPR 2025");
    expect(conf.id).toBe("cvpr-2025");
  });

  it("uses provided ID if given", () => {
    const conf = createDefaultConference("CVPR 2025", "my-custom-id");
    expect(conf.id).toBe("my-custom-id");
  });

  it("strips leading/trailing hyphens from generated slug", () => {
    const conf = createDefaultConference("  ICCV  ");
    expect(conf.id).not.toMatch(/^-/);
    expect(conf.id).not.toMatch(/-$/);
  });

  it("initializes with planning status", () => {
    const conf = createDefaultConference("Test");
    expect(conf.status).toBe("planning");
  });

  it("initializes with empty attendees and candidates arrays", () => {
    const conf = createDefaultConference("Test");
    expect(conf.attendees).toEqual([]);
    expect(conf.candidates).toEqual([]);
  });

  it("populates all 5 action item phases", () => {
    const conf = createDefaultConference("Test");
    const phases = Object.keys(conf.actionItems);
    expect(phases).toHaveLength(5);
    expect(phases).toContain("Pre-Conference Setup");
    expect(phases).toContain("Content & Outreach Prep");
    expect(phases).toContain("Logistics & Coordination");
    expect(phases).toContain("Event Week");
    expect(phases).toContain("Post-Conference");
  });

  it("gives each action item a unique ID", () => {
    const conf = createDefaultConference("Test");
    const allIds = Object.values(conf.actionItems).flat().map((ai) => ai.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("creates deep copies of action items (not shared references)", () => {
    const a = createDefaultConference("A");
    const b = createDefaultConference("B");
    // Mutating A's action items should not affect B's
    const aPhase = Object.keys(a.actionItems)[0];
    a.actionItems[aPhase][0].task = "MUTATED";
    expect(b.actionItems[aPhase][0].task).not.toBe("MUTATED");
  });

  it("includes booth, private event, budget, and strategy defaults", () => {
    const conf = createDefaultConference("Test");
    expect(conf.booth).toBeDefined();
    expect(conf.booth.size).toBe("10x10");
    expect(conf.privateEvent).toBeDefined();
    expect(conf.budget).toBeDefined();
    expect(conf.budget.lineItems.length).toBeGreaterThan(0);
    expect(conf.strategy).toBeDefined();
  });
});

describe("createDefaultBooth", () => {
  it("creates booth with 10x10 default size", () => {
    expect(createDefaultBooth().size).toBe("10x10");
  });

  it("has all required design fields", () => {
    const booth = createDefaultBooth();
    expect(booth.design.status).toBe("not_started");
    expect(booth.design.deadline).toBe("");
    expect(booth.design.notes).toBe("");
  });

  it("includes materials checklist", () => {
    const booth = createDefaultBooth();
    expect(booth.materials.length).toBe(DEFAULT_BOOTH_MATERIALS.length);
    expect(booth.materials.every((m) => m.packed === false)).toBe(true);
  });

  it("creates deep copies of materials", () => {
    const a = createDefaultBooth();
    const b = createDefaultBooth();
    a.materials[0].packed = true;
    expect(b.materials[0].packed).toBe(false);
  });

  it("initializes shipping with Freeman carrier", () => {
    const booth = createDefaultBooth();
    expect(booth.shipping.carrier).toBe("Freeman");
    expect(booth.shipping.status).toBe("not_started");
  });
});

describe("createDefaultBudget", () => {
  it("initializes all headcount fields to 0", () => {
    const budget = createDefaultBudget();
    expect(budget.headcount.recruiting).toBe(0);
    expect(budget.headcount.research).toBe(0);
    expect(budget.headcount.engineering).toBe(0);
    expect(budget.headcount.marketing).toBe(0);
    expect(budget.headcount.total).toBe(0);
  });

  it("populates default line items", () => {
    const budget = createDefaultBudget();
    expect(budget.lineItems.length).toBe(DEFAULT_BUDGET_LINE_ITEMS.length);
    expect(budget.lineItems.length).toBeGreaterThan(10);
  });

  it("creates deep copies of line items", () => {
    const a = createDefaultBudget();
    const b = createDefaultBudget();
    a.lineItems[0].actualSpend = 9999;
    expect(b.lineItems[0].actualSpend).toBe(0);
  });

  it("includes summary and team spend sections", () => {
    const budget = createDefaultBudget();
    expect(budget.summary.length).toBeGreaterThan(0);
    expect(budget.teamSpend.length).toBeGreaterThan(0);
  });
});

describe("createDefaultPrivateEvent", () => {
  it("initializes with empty fields", () => {
    const event = createDefaultPrivateEvent();
    expect(event.venue).toBe("");
    expect(event.capacity).toBe("");
    expect(event.catering).toBe("");
    expect(event.invitesSent).toBe(false);
    expect(event.rsvpCount).toBe(0);
  });
});

describe("createDefaultStrategy", () => {
  it("initializes with empty string fields", () => {
    const strategy = createDefaultStrategy();
    expect(strategy.goals).toBe("");
    expect(strategy.targetProfiles).toBe("");
    expect(strategy.keyMessages).toBe("");
    expect(strategy.successMetrics).toBe("");
  });
});

describe("DEFAULT_ACTION_ITEMS template", () => {
  it("has action items in each phase", () => {
    for (const [, items] of Object.entries(DEFAULT_ACTION_ITEMS)) {
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(item.task).toBeTruthy();
        expect(item.status).toBe("not_started");
      }
    }
  });
});
