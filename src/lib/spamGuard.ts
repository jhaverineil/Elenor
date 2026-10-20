// ─── Lightweight abuse protection for the public form endpoints ─────────────
// 1. Honeypot: a visually hidden field real visitors never fill in.
// 2. Time trap: submissions sent within two seconds of the form rendering.
// 3. Rate limit: a per-IP sliding window. It lives in memory, so on serverless
//    hosting it is per-instance and best-effort; pair it with the host's own
//    protection (e.g. Netlify rate limiting rules) for stronger guarantees.

const MIN_FILL_MS = 2000;
const hits = new Map<string, number[]>();

export function clientIp(req: Request) {
  return (
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return false;
}

/** Returns a visitor-facing reason when a submission looks automated. */
export function botCheck(input: { website?: string; startedAt?: number }): string | null {
  if (input.website) return 'Your message could not be sent. Please try again later.';
  if (input.startedAt && Date.now() - input.startedAt < MIN_FILL_MS) {
    return 'That was very quick — please wait a moment and send again.';
  }
  return null;
}
