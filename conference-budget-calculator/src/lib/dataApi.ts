/**
 * Server-side helper for making authenticated requests to the Data API proxy.
 * All Google/Slack/Jira/etc. calls go through here — the platform injects
 * OAuth credentials automatically based on the X-Request-Token.
 *
 * Local dev:  URL_BASE is unset → hits http://localhost:8080, no identity token needed
 * Production: URL_BASE is set   → hits https://dataapi.{URL_BASE}, identity token required
 */

function getDataApiBase(): string {
  const urlBase = process.env.URL_BASE;
  return urlBase ? `https://dataapi.${urlBase}` : "http://localhost:8080";
}

async function getAuthHeaders(url: string): Promise<Record<string, string>> {
  const urlBase = process.env.URL_BASE;
  if (!urlBase) return {};

  const audience = `https://dataapi.${urlBase}`;
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(audience);
  return client.getRequestHeaders(url) as unknown as Promise<Record<string, string>>;
}

export async function dataApiFetch(
  path: string,
  requestToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const base = getDataApiBase();
  const url = `${base}${path}`;

  const authHeaders = await getAuthHeaders(url);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Request-Token": requestToken,
    ...authHeaders,
    ...(options.headers as Record<string, string> | undefined),
  };

  return fetch(url, { ...options, headers });
}
