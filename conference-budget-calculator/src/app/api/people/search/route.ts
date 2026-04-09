import { NextRequest, NextResponse } from "next/server";

const ANAHEIM_API_KEY = process.env.ANAHEIM_API_KEY || "";
const ANAHEIM_BASE = "https://anaheim.applied.co/applied/api/v1";

// GET /api/people/search?q=john.smith@applied.co  — lookup by email
// GET /api/people/search?q=john                    — search by name (uses POST filter)
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  if (!ANAHEIM_API_KEY) {
    return NextResponse.json(
      { error: "Anaheim API key not configured. Create one at https://anaheim.applied.co/anaheim/admin/?tab=api-keys with user:read scope, then set ANAHEIM_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    // If query looks like an email, do a direct user lookup
    if (query.includes("@")) {
      const res = await fetch(`${ANAHEIM_BASE}/user/${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `ApiKey ${ANAHEIM_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        return NextResponse.json({ results: [] });
      }

      const person = await res.json();
      return NextResponse.json({
        results: [mapPerson(person)],
      });
    }

    // Otherwise, use the POST filter endpoint to search by name-like fields
    // The Anaheim API filters by team/title/email/manager — for name search,
    // we try matching as a team name or do a broad filter
    // Since there's no name search endpoint, we'll search common team patterns
    // and also try as an email prefix
    const emailGuess = `${query.toLowerCase().replace(/\s+/g, ".")}@applied.co`;

    // Try direct email lookup first (handles "zoya.hsiao" -> "zoya.hsiao@applied.co")
    const directRes = await fetch(`${ANAHEIM_BASE}/user/${encodeURIComponent(emailGuess)}`, {
      headers: {
        Authorization: `ApiKey ${ANAHEIM_API_KEY}`,
        Accept: "application/json",
      },
    });

    const results: ReturnType<typeof mapPerson>[] = [];

    if (directRes.ok) {
      const person = await directRes.json();
      if (person.firstName) {
        results.push(mapPerson(person));
      }
    }

    // Also try the query as a first.last pattern
    if (results.length === 0 && !query.includes(".")) {
      // Try first name only — look up common patterns
      const firstNameGuess = `${query.toLowerCase()}@applied.co`;
      const firstRes = await fetch(`${ANAHEIM_BASE}/user/${encodeURIComponent(firstNameGuess)}`, {
        headers: {
          Authorization: `ApiKey ${ANAHEIM_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (firstRes.ok) {
        const person = await firstRes.json();
        if (person.firstName) {
          results.push(mapPerson(person));
        }
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Anaheim API error:", err);
    return NextResponse.json({ error: "Failed to reach Anaheim API" }, { status: 502 });
  }
}

// POST /api/people/search — filter by team, title, etc.
export async function POST(request: NextRequest) {
  if (!ANAHEIM_API_KEY) {
    return NextResponse.json({ error: "Anaheim API key not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();

    const res = await fetch(`${ANAHEIM_BASE}/user`, {
      method: "POST",
      headers: {
        Authorization: `ApiKey ${ANAHEIM_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Anaheim API returned ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    const users = (data.users || []).map(mapPerson);

    return NextResponse.json({ results: users });
  } catch (err) {
    console.error("Anaheim API error:", err);
    return NextResponse.json({ error: "Failed to reach Anaheim API" }, { status: 502 });
  }
}

function mapPerson(p: Record<string, unknown>) {
  return {
    name: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
    firstName: (p.firstName as string) || "",
    lastName: (p.lastName as string) || "",
    email: (p.email as string) || "",
    phone: (p.phone as string) || "",
    team: (p.teamName as string) || "",
    title: (p.title as string) || "",
    office: (p.office as string) || "",
    slackId: (p.slackId as string) || "",
    profileImageUrl: (p.profileImageUrl as string) || "",
  };
}
