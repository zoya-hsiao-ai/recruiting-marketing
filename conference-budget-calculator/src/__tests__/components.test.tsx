import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createDefaultConference } from "../lib/defaults";
import type { Conference } from "../lib/types";
import ActionItemsTab from "../components/ActionItemsTab";
import BudgetTab from "../components/BudgetTab";
import AttendeesTab from "../components/AttendeesTab";

// Suppress fetch calls from PeopleSearch
vi.stubGlobal("fetch", vi.fn());

function makeConference(overrides: Partial<Conference> = {}): Conference {
  return { ...createDefaultConference("Test Conference"), ...overrides };
}

describe("ActionItemsTab", () => {
  it("renders all default phases", () => {
    const conf = makeConference();
    render(<ActionItemsTab conference={conf} update={vi.fn()} />);

    expect(screen.getByText("Pre-Conference Setup")).toBeInTheDocument();
    expect(screen.getByText("Content & Outreach Prep")).toBeInTheDocument();
    expect(screen.getByText("Logistics & Coordination")).toBeInTheDocument();
    expect(screen.getByText("Event Week")).toBeInTheDocument();
    expect(screen.getByText("Post-Conference")).toBeInTheDocument();
  });

  it("renders action items within phases", () => {
    const conf = makeConference();
    render(<ActionItemsTab conference={conf} update={vi.fn()} />);

    expect(screen.getByDisplayValue("Draft conference proposal")).toBeInTheDocument();
  });

  it("calls update when adding a new action item", () => {
    const update = vi.fn();
    const conf = makeConference();
    render(<ActionItemsTab conference={conf} update={update} />);

    const addButtons = screen.getAllByText("Add action item");
    fireEvent.click(addButtons[0]);

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        actionItems: expect.any(Object),
      })
    );
  });

  it("calls update when changing an action item status", () => {
    const update = vi.fn();
    const conf = makeConference();
    render(<ActionItemsTab conference={conf} update={update} />);

    const statusSelects = screen.getAllByDisplayValue("Not Started");
    fireEvent.change(statusSelects[0], { target: { value: "completed" } });

    expect(update).toHaveBeenCalledTimes(1);
  });

  it("renders phase completion counts", () => {
    const conf = makeConference();
    render(<ActionItemsTab conference={conf} update={vi.fn()} />);

    // Each phase shows completion like "0/9 complete"
    const completionCounts = screen.getAllByText(/complete/);
    expect(completionCounts.length).toBeGreaterThan(0);
  });

  it("has status filter dropdown", () => {
    const conf = makeConference();
    render(<ActionItemsTab conference={conf} update={vi.fn()} />);

    // The filter shows "All" as default for status
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("+ Add Phase")).toBeInTheDocument();
  });
});

describe("BudgetTab", () => {
  it("renders headcount section", () => {
    const conf = makeConference();
    render(<BudgetTab conference={conf} update={vi.fn()} />);

    // Labels are lowercase due to CSS capitalize
    expect(screen.getByText("Headcount")).toBeInTheDocument();
    expect(screen.getByText("recruiting:")).toBeInTheDocument();
    expect(screen.getByText("research:")).toBeInTheDocument();
    expect(screen.getByText("engineering:")).toBeInTheDocument();
    expect(screen.getByText("marketing:")).toBeInTheDocument();
  });

  it("renders default line items", () => {
    const conf = makeConference();
    render(<BudgetTab conference={conf} update={vi.fn()} />);

    expect(screen.getByDisplayValue("Hotel Room for 1 person/night")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Flight for 1 person roundtrip")).toBeInTheDocument();
  });

  it("updates headcount total when a field changes", () => {
    const update = vi.fn();
    const conf = makeConference();
    render(<BudgetTab conference={conf} update={update} />);

    const recruitingInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(recruitingInput, { target: { value: "5" } });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        budget: expect.objectContaining({
          headcount: expect.objectContaining({
            total: expect.any(Number),
          }),
        }),
      })
    );
  });

  it("can add a new line item", () => {
    const update = vi.fn();
    const conf = makeConference();
    render(<BudgetTab conference={conf} update={update} />);

    const addButton = screen.getByText("Add line item");
    fireEvent.click(addButton);

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        budget: expect.objectContaining({
          lineItems: expect.any(Array),
        }),
      })
    );

    const newLineItems = update.mock.calls[0][0].budget.lineItems;
    expect(newLineItems.length).toBe(conf.budget.lineItems.length + 1);
  });

  it("can remove a line item", () => {
    const update = vi.fn();
    const conf = makeConference();
    const { container } = render(<BudgetTab conference={conf} update={update} />);

    // Remove buttons are SVG-icon buttons in the table body
    const removeButtons = container.querySelectorAll("tbody button");
    expect(removeButtons.length).toBeGreaterThan(0);
    fireEvent.click(removeButtons[0]);

    const newLineItems = update.mock.calls[0][0].budget.lineItems;
    expect(newLineItems.length).toBe(conf.budget.lineItems.length - 1);
  });
});

describe("AttendeesTab", () => {
  it("renders summary stats", () => {
    const conf = makeConference();
    render(<AttendeesTab conference={conf} update={vi.fn()} />);

    // Summary shows "Total: 0"
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("Confirmed:")).toBeInTheDocument();
  });

  it("shows 'Add Manually' button", () => {
    const conf = makeConference();
    render(<AttendeesTab conference={conf} update={vi.fn()} />);

    expect(screen.getByText("+ Add Manually")).toBeInTheDocument();
  });

  it("shows 'Search Anaheim' button", () => {
    const conf = makeConference();
    render(<AttendeesTab conference={conf} update={vi.fn()} />);

    expect(screen.getByText("Search Anaheim")).toBeInTheDocument();
  });

  it("adds a blank attendee when 'Add Manually' is clicked", () => {
    const update = vi.fn();
    const conf = makeConference();
    render(<AttendeesTab conference={conf} update={update} />);

    fireEvent.click(screen.getByText("+ Add Manually"));

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        attendees: expect.arrayContaining([
          expect.objectContaining({ name: "", team: "" }),
        ]),
      })
    );
  });

  it("renders existing attendees", () => {
    const conf = makeConference({
      attendees: [
        {
          id: "att-1",
          name: "Alice Engineer",
          team: "Engineering",
          dates: "June 15-18",
          hotelNights: 3,
          confirmed: "confirmed",
          ieeeMemberNumber: "",
          tshirtSize: "M",
          foodPreference: "",
          conferenceRegistered: true,
          conferenceConfirmationNumber: "",
          hotelBooked: true,
          hotelBookingNote: "",
          hotelConfirmationNumber: "",
          hotelTotalCost: 900,
          flightsBooked: true,
          flightTotalCost: 450,
          flightInfoOutbound: "",
          flightInfoReturn: "",
          notes: "",
        },
      ],
    });

    render(<AttendeesTab conference={conf} update={vi.fn()} />);
    expect(screen.getByDisplayValue("Alice Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument();
  });

  it("can remove an attendee", () => {
    const update = vi.fn();
    const conf = makeConference({
      attendees: [
        {
          id: "att-1",
          name: "Bob",
          team: "Research",
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
      ],
    });

    const { container } = render(<AttendeesTab conference={conf} update={update} />);

    // Remove button is an SVG-icon button in the table body
    const removeButton = container.querySelector("tbody button");
    expect(removeButton).not.toBeNull();
    fireEvent.click(removeButton!);

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        attendees: [],
      })
    );
  });
});
