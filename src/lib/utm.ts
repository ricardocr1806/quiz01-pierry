const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

export type UtmData = Partial<Record<typeof UTM_KEYS[number], string>>;

export function captureUtms(): UtmData {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utms: UtmData = {};
  UTM_KEYS.forEach(k => { const v = params.get(k); if (v) utms[k] = v; });
  if (Object.keys(utms).length > 0) sessionStorage.setItem("utms", JSON.stringify(utms));
  return utms;
}

export function getUtms(): UtmData {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(sessionStorage.getItem("utms") ?? "{}"); } catch { return {}; }
}

export function appendUtmsToUrl(baseUrl: string): string {
  const utms = getUtms();
  if (!Object.keys(utms).length) return baseUrl;
  const params = new URLSearchParams(utms as Record<string, string>);
  return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${params.toString()}`;
}
