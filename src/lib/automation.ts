/**
 * Forwards an event to the optional automation webhook (e.g. n8n) so the
 * studio can be emailed about new enquiries. The database remains the source
 * of truth; a webhook failure is logged and never fails the visitor's request.
 */
export async function forwardToAutomation(event: string, data: Record<string, unknown>) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data, sentAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[automation] ${event} webhook responded ${res.status}`);
  } catch (error) {
    console.error(`[automation] ${event} webhook failed:`, error);
  }
}
