/**
 * Google Sheets proxy routes:
 *   GET /api/sheets?id={spreadsheetId}              → spreadsheet metadata (sheet names)
 *   GET /api/sheets?id={spreadsheetId}&sheet={name} → row values from a sheet
 */
import { NextRequest, NextResponse } from "next/server";
import { dataApiFetch } from "@/lib/dataApi";

export async function GET(req: NextRequest) {
  const requestToken = req.headers.get("X-Request-Token") ?? "";
  const spreadsheetId = req.nextUrl.searchParams.get("id");
  const sheetName = req.nextUrl.searchParams.get("sheet");

  if (!spreadsheetId) {
    return NextResponse.json({ error: "Missing spreadsheet id" }, { status: 400 });
  }

  if (sheetName) {
    // Fetch all values from the named sheet
    const range = encodeURIComponent(`${sheetName}!A1:Z500`);
    const resp = await dataApiFetch(
      `/api/data/sheets/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      requestToken
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `Sheets API error: ${text}` },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);
  }

  // Fetch spreadsheet metadata to get sheet names
  const resp = await dataApiFetch(
    `/api/data/sheets/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    requestToken
  );

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json(
      { error: `Sheets API error: ${text}` },
      { status: resp.status }
    );
  }

  const data = await resp.json();
  return NextResponse.json(data);
}
