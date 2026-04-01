/**
 * Starts an OAuth flow for the given integration alias.
 * Returns { url } — the client opens this in a popup.
 */
import { NextRequest, NextResponse } from "next/server";
import { dataApiFetch } from "@/lib/dataApi";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ integration: string }> }
) {
  const { integration } = await params;
  const requestToken = req.headers.get("X-Request-Token") ?? "";

  const resp = await dataApiFetch(
    `/api/data/oauth/start?integration=${integration}`,
    requestToken,
    { method: "POST" }
  );

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json(
      { error: `OAuth start failed: ${text}` },
      { status: resp.status }
    );
  }

  const data = await resp.json();
  return NextResponse.json(data);
}
