# Elenor website — handover

Elenor is a curated beauty house ("a considered edit of beauty"). The website
presents the brand and its products and converts visitors into **enquiries,
notify-me requests and newsletter sign-ups**. It does not sell online or list
prices. The design follows the live reference site (https://elenorr.netlify.app).

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the values — see below
npm run dev                   # http://localhost:3333
npm run build && npm start    # production build
```

Run `supabase_schema.sql` in the Supabase SQL editor once. Only the `contacts`
and `admins` tables are used by the current site.

## Environment variables (`.env.example`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URLs, Open Graph, sitemap. Set to the final domain. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Recommended | Stores enquiries / sign-ups for the `/admin` inbox. If neither Supabase nor SMTP is set, forms return "temporarily unavailable" (never a fake success). |
| `ADMIN_JWT_SECRET` | Yes (prod) | Signs admin sessions. Admin sign-in is disabled in production without it (`NEXTAUTH_SECRET` is still accepted for older deployments). |
| `SMTP_USER`, `SMTP_PASS` | Yes | Emails every enquiry to the studio. Gmail address + 16-character App Password (see below). |
| `ENQUIRY_NOTIFY_TO` | Optional | Recipient of enquiry emails. Defaults to `xyz@gmail.com`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` | Optional | Only for non-Gmail providers (defaults: `smtp.gmail.com`, `465`, `SMTP_USER`). |
| `N8N_WEBHOOK_URL` | Optional | Receives `inquiry.created` / `newsletter.subscribed` events. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Optional | Official profile. Instagram links stay hidden until set. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | Overrides the studio WhatsApp number (+91 99243 96959). |

### Gmail setup (enquiry emails)

1. Sign in to the Gmail account that will send the emails.
2. Turn on 2-Step Verification: https://myaccount.google.com/security
3. Create an App Password at https://myaccount.google.com/apppasswords (name it
   "Elenor Website") and copy the 16-character code.
4. In Netlify → Site configuration → Environment variables, add `SMTP_USER`
   (the Gmail address) and `SMTP_PASS` (the code, without spaces), then trigger
   a new deploy.
5. Send a test enquiry. The first email may land in Spam — mark it "Not spam".

Each email includes the visitor's details, topic, product and message;
replying to it answers the visitor directly. A submission succeeds if it
reaches the inbox (Supabase) or the email — whichever is configured.

`NEXT_PUBLIC_*` values are baked in at build time — redeploy after changing them.

## Routes

| Route | Notes |
| --- | --- |
| `/` | Hero video, intro, collection, signature, philosophy, materia, lookbook teaser, FAQ, newsletter |
| `/about` | Story, approach, philosophy, craft, "at a glance" facts |
| `/products`, `/products/[slug]` | Collection + data-driven detail template (ingredients, directions, size, claims) |
| `/lookbook` | Filterable gallery with keyboard/touch lightbox, coming-soon pieces |
| `/notify-me`, `/notify-me/[slug]` | Release notifications for the four coming-soon pieces |
| `/contact` | Enquiry form (`?topic=` and `?product=` prefill), studio details |
| `/faq` | Grouped FAQ (also emitted as FAQPage structured data) |
| `/offers` | Driven by `src/data/offers.ts`; hidden from nav/footer/sitemap and `noindex` while no offer is active |
| `/privacy-policy`, `/terms-and-conditions` | Describe what the site actually does — update when integrations change |
| `/admin`, `/admin/login` | Studio inbox (unchanged); every submission appears here, tagged by topic |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/manifest.webmanifest` | Generated from the data files |

Redirects (in `next.config.ts`): `/collections`, `/services` → `/products`;
`/gallery` → `/lookbook`; `/book-appointment` → `/contact?topic=studio`;
retired `/cart`, `/checkout`, `/auth/*` → live pages.

## Where content lives

- `src/data/site.ts` — brand facts, contact details, navigation
- `src/data/products.ts` — products (transcribed from packaging) and coming-soon pieces
- `src/data/faqs.ts` — FAQ answers (only restate published facts)
- `src/data/gallery.ts`, `src/data/offers.ts`, `src/data/brand.ts`
- `src/lib/validation.ts` — form schemas shared by browser and API
- `src/lib/seo.ts` — structured data (Organization, WebSite, FAQPage, …)

## Form protection

Honeypot field, a two-second time trap, per-IP rate limiting (in-memory, so
best-effort on serverless — add Netlify rate-limit rules for stronger limits),
and server-side Zod validation. Success is only shown after Supabase accepts
the row.

## Notes and follow-ups

- `public/videos/hero.mp4` is ~19 MB for a 5-second loop. It only loads on
  desktop (not on mobile, reduced-motion or data-saver), but re-encoding it to
  ~2–3 MB (e.g. `ffmpeg -crf 28 -preset slow -an -vf scale=1600:-2`) is worthwhile.
- The press address `press@elenor.studio` comes from the live site — confirm it.
- Legal pages are written to match the site's real behaviour but have not been
  reviewed by a lawyer.
- `legacy/` holds the retired storefront; see `legacy/README.md`.
