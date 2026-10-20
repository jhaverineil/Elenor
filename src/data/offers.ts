// ─── Offers ──────────────────────────────────────────────────────────────────
// Elenor has no promotions running. Add an entry here when one is approved;
// it appears in the navigation, footer, homepage and /offers only while
// today's date falls inside its validity window. Pages re-check hourly.

export interface Offer {
  slug: string;
  title: string;
  description: string;
  /** Wording of the benefit exactly as approved, e.g. "Complimentary gift wrap". */
  benefit: string;
  /** ISO dates, inclusive, in the studio's local time. */
  validFrom: string;
  validUntil: string;
  eligibility?: string;
  terms: string[];
  cta: { href: string; label: string };
}

export const OFFERS: Offer[] = [];

export function getActiveOffers(now: Date = new Date()): Offer[] {
  const today = now.toISOString().slice(0, 10);
  return OFFERS.filter((o) => o.validFrom <= today && today <= o.validUntil);
}

export function formatOfferDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
