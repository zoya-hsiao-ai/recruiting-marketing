import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the route handler by importing it and passing mock NextRequest objects.
// We need to mock the global fetch used by the route to call Anaheim.

const mockFetch = vi.fn();

// Store original
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = mockFetch;
  mockFetch.mockReset();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

// Helper to create a NextRequest-like object
function makeRequest(url: string): { nextUrl: { searchParams: URLSearchParams } } {
  const parsed = new URL(url, "http://localhost:3000");
  return {
    nextUrl: parsed,
  };
}

function makeAnaheimPerson(overrides: Record<string, unknown> = {}) {
  return {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@applied.co",
    phone: "+1-555-0100",
    teamName: "Engineering",
    title: "Software Engineer",
    office: "San Carlos",
    slackId: "U123",
    profileImageUrl: "https://example.com/photo.jpg",
    ...overrides,
  };
}

describe("GET /api/people/search", () => {
  it("returns 400 for queries shorter than 2 characters", async () => {
    // Need to import fresh each time because env vars are read at module level
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    const { GET } = await import("../app/api/people/search/route");
    const req = makeRequest("/api/people/search?q=a");
    const res = await GET(req as never);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toMatch(/at least 2 characters/);
  });

  it("returns 503 when ANAHEIM_API_KEY is not set", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "");
    // Force re-import to pick up new env
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");
    const req = makeRequest("/api/people/search?q=jane");
    const res = await GET(req as never);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/API key not configured/);
  });

  it("looks up by email when query contains @", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");

    const person = makeAnaheimPerson();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(person),
    });

    const req = makeRequest("/api/people/search?q=jane.doe@applied.co");
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.results).toHaveLength(1);
    expect(body.results[0].name).toBe("Jane Doe");
    expect(body.results[0].email).toBe("jane.doe@applied.co");
    expect(body.results[0].team).toBe("Engineering");
    expect(body.results[0].title).toBe("Software Engineer");
    expect(body.results[0].profileImageUrl).toBe("https://example.com/photo.jpg");

    // Verify fetch was called with the right URL and auth header
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/jane.doe%40applied.co"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "ApiKey test-key",
        }),
      })
    );
  });

  it("returns empty results when email lookup fails", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");

    mockFetch.mockResolvedValueOnce({ ok: false });

    const req = makeRequest("/api/people/search?q=nobody@applied.co");
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.results).toEqual([]);
  });

  it("guesses email pattern for name-based queries", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");

    const person = makeAnaheimPerson({ firstName: "John", lastName: "Smith", email: "john.smith@applied.co" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(person),
    });

    const req = makeRequest("/api/people/search?q=john smith");
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.results).toHaveLength(1);
    expect(body.results[0].name).toBe("John Smith");
    // Should have tried john.smith@applied.co
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/john.smith%40applied.co"),
      expect.any(Object)
    );
  });

  it("falls back to first-name-only guess when dot pattern fails", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");

    // First call (name guess) fails
    mockFetch.mockResolvedValueOnce({ ok: false });
    // Second call (first name only) succeeds
    const person = makeAnaheimPerson({ firstName: "Zoya", lastName: "Hsiao", email: "zoya@applied.co" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(person),
    });

    const req = makeRequest("/api/people/search?q=zoya");
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.results).toHaveLength(1);
    expect(body.results[0].firstName).toBe("Zoya");
  });

  it("returns 502 when Anaheim API throws a network error", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = makeRequest("/api/people/search?q=jane.doe@applied.co");
    const res = await GET(req as never);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/Failed to reach Anaheim/);
  });
});

describe("POST /api/people/search", () => {
  it("returns 503 when ANAHEIM_API_KEY is not set", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "");
    vi.resetModules();
    const { POST } = await import("../app/api/people/search/route");

    const req = { json: () => Promise.resolve({ teamName: "Engineering" }) };
    const res = await POST(req as never);
    expect(res.status).toBe(503);
  });

  it("forwards filter body to Anaheim and returns mapped results", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { POST } = await import("../app/api/people/search/route");

    const people = [
      makeAnaheimPerson({ firstName: "Alice", lastName: "A", email: "alice@applied.co" }),
      makeAnaheimPerson({ firstName: "Bob", lastName: "B", email: "bob@applied.co" }),
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ users: people }),
    });

    const req = { json: () => Promise.resolve({ teamName: "Engineering" }) };
    const res = await POST(req as never);
    const body = await res.json();

    expect(body.results).toHaveLength(2);
    expect(body.results[0].name).toBe("Alice A");
    expect(body.results[1].name).toBe("Bob B");
  });

  it("returns error status when Anaheim returns non-OK", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { POST } = await import("../app/api/people/search/route");

    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });

    const req = { json: () => Promise.resolve({}) };
    const res = await POST(req as never);
    expect(res.status).toBe(403);
  });
});

describe("mapPerson (via route response)", () => {
  it("handles missing fields gracefully", async () => {
    vi.stubEnv("ANAHEIM_API_KEY", "test-key");
    vi.resetModules();
    const { GET } = await import("../app/api/people/search/route");

    // Minimal person with only firstName
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ firstName: "Sparse" }),
    });

    const req = makeRequest("/api/people/search?q=sparse@applied.co");
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.results[0].name).toBe("Sparse");
    expect(body.results[0].lastName).toBe("");
    expect(body.results[0].email).toBe("");
    expect(body.results[0].team).toBe("");
    expect(body.results[0].phone).toBe("");
  });
});
