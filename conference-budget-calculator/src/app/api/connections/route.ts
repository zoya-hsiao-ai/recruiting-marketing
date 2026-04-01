/**
 * Lists the current user's active OAuth connections.
 */
import { NextRequest, NextResponse } from "next/server";
import { dataApiFetch } from "@/lib/dataApi";

export async function GET(req: NextRequest) {
  const requestToken = req.headers.get("X-Request-Token") ?? "";

  const resp = await dataApiFetch("/api/data/connections", requestToken);

  if (!resp.ok) {
    return NextResponse.json(
      { error: "Failed to fetch connections", connections: [] },
      { status: resp.status }
    );
  }

  const data = await resp.json();
  return NextResponse.json(data);
}
