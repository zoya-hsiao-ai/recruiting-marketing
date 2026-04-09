import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PeopleSearch from "../components/PeopleSearch";

// Mock fetch
const mockFetch = vi.fn();
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = mockFetch;
  mockFetch.mockReset();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.useRealTimers();
});

function makePeopleResponse(people: Array<{ firstName: string; lastName: string; email: string; team?: string }>) {
  return {
    results: people.map((p) => ({
      name: `${p.firstName} ${p.lastName}`,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: "",
      team: p.team || "Engineering",
    })),
  };
}

describe("PeopleSearch", () => {
  it("renders search input and focuses it", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<PeopleSearch onSelect={onSelect} onClose={onClose} />);

    const input = screen.getByPlaceholderText("Search people by name...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("shows 'Powered by Anaheim' footer", () => {
    render(<PeopleSearch onSelect={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/Powered by Anaheim/)).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<PeopleSearch onSelect={vi.fn()} onClose={onClose} />);

    const input = screen.getByPlaceholderText("Search people by name...");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<PeopleSearch onSelect={vi.fn()} onClose={onClose} />);

    // Click the backdrop (outermost div)
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not search for queries shorter than 2 characters", () => {
    render(<PeopleSearch onSelect={vi.fn()} onClose={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search people by name...");
    fireEvent.change(input, { target: { value: "a" } });
    vi.advanceTimersByTime(500);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("debounces search requests", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(makePeopleResponse([])),
    });

    render(<PeopleSearch onSelect={vi.fn()} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search people by name...");

    // Type quickly
    fireEvent.change(input, { target: { value: "ja" } });
    fireEvent.change(input, { target: { value: "jan" } });
    fireEvent.change(input, { target: { value: "jane" } });

    // Before debounce fires, no fetch
    expect(mockFetch).not.toHaveBeenCalled();

    // After debounce (300ms)
    vi.advanceTimersByTime(300);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("q=jane")
    );
  });

  it("displays search results", async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(
          makePeopleResponse([
            { firstName: "Jane", lastName: "Doe", email: "jane.doe@applied.co", team: "Engineering" },
          ])
        ),
    });

    render(<PeopleSearch onSelect={vi.fn()} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search people by name...");

    fireEvent.change(input, { target: { value: "jane" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("jane.doe@applied.co")).toBeInTheDocument();
    });
  });

  it("calls onSelect and onClose when a result is clicked", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve(
          makePeopleResponse([
            { firstName: "Jane", lastName: "Doe", email: "jane.doe@applied.co" },
          ])
        ),
    });

    render(<PeopleSearch onSelect={onSelect} onClose={onClose} />);
    const input = screen.getByPlaceholderText("Search people by name...");

    fireEvent.change(input, { target: { value: "jane" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => screen.getByText("Jane Doe"));

    fireEvent.click(screen.getByText("Jane Doe"));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@applied.co",
      })
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("shows no results message for empty search", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ results: [] }),
    });

    render(<PeopleSearch onSelect={vi.fn()} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search people by name...");

    fireEvent.change(input, { target: { value: "zzzzz" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
  });

  it("shows error message when API fails", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ error: "Failed to search" }),
    });

    render(<PeopleSearch onSelect={vi.fn()} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search people by name...");

    fireEvent.change(input, { target: { value: "error" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Failed to search")).toBeInTheDocument();
    });
  });
});
