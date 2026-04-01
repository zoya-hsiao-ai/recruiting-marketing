/**
 * Returns the X-Request-Token injected by the platform proxy.
 * The client calls this once on mount to get its session token.
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestToken = req.headers.get("X-Request-Token") ?? "";
  return NextResponse.json({ requestToken });
}
