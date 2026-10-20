import type { StudioMail } from './mailer';
import { SITE, absoluteUrl } from '@/data/site';
import { EMAIL_LOGO } from './emailLogo';

// ─── Studio notification email ───────────────────────────────────────────────
// Table-based layout with inline styles so it renders consistently in Gmail,
// Outlook and Apple Mail. Every visitor-supplied value is HTML-escaped.

export interface SubmissionEmailInput {
  kind: 'enquiry' | 'notify' | 'newsletter';
  name?: string;
  email: string;
  phone?: string;
  /** Topic label as shown in the admin inbox, e.g. "Product availability". */
  topic: string;
  /** Product or forthcoming piece the visitor asked about. */
  item?: string;
  message?: string;
  reference: string;
  storedInInbox: boolean;
  receivedAt: Date;
}

const C = {
  page: '#f3e7de',
  card: '#fffaf6',
  line: '#ead9c6',
  ink: '#2a2a2a',
  muted: '#6b6258',
  gold: '#c9a14b',
  mauve: '#8b6a7c',
  noir: '#1a1416',
  wash: '#fbf4ee',
};

const HEADINGS: Record<SubmissionEmailInput['kind'], { eyebrow: string; title: string }> = {
  enquiry: { eyebrow: 'New website enquiry', title: 'A new enquiry has arrived' },
  notify: { eyebrow: 'Notify-me request', title: 'Someone is waiting for a new piece' },
  newsletter: { eyebrow: 'Newsletter', title: 'A new subscriber to Letters from Elenor' },
};

function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Header-safe single line (no CR/LF), trimmed to a sensible length. */
function oneLine(value: string, max = 140) {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function whatsappFor(phone?: string) {
  const digits = (phone ?? '').replace(/[^\d]/g, '');
  // Only offer WhatsApp when the number carries a country code.
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
}

function formatReceived(date: Date) {
  return `${new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)} IST`;
}

export function submissionEmail(input: SubmissionEmailInput): StudioMail {
  const heading = HEADINGS[input.kind];
  const who = input.name?.trim() || input.email;
  const firstName = input.name?.trim().split(/\s+/)[0] || 'them';
  const received = formatReceived(input.receivedAt);
  const wa = whatsappFor(input.phone);

  const subject =
    input.kind === 'newsletter'
      ? oneLine(`New newsletter subscriber: ${input.email}`)
      : input.kind === 'notify'
        ? oneLine(`Notify me: ${input.item ?? 'a forthcoming piece'} — ${who}`)
        : oneLine(`New enquiry: ${input.topic}${input.item ? ` (${input.item})` : ''} — ${who}`);

  const replySubject = encodeURIComponent(
    input.kind === 'newsletter' ? 'Letters from Elenor' : `Re: your enquiry to Èlenor${input.item ? ` — ${input.item}` : ''}`,
  );

  const rows: [string, string][] = [];
  if (input.name) rows.push(['Name', esc(input.name)]);
  rows.push(['Email', `<a href="mailto:${esc(input.email)}" style="color:${C.mauve};text-decoration:none;">${esc(input.email)}</a>`]);
  if (input.phone) {
    rows.push([
      'Phone',
      `<a href="tel:${esc(input.phone.replace(/[^\d+]/g, ''))}" style="color:${C.mauve};text-decoration:none;">${esc(input.phone)}</a>`,
    ]);
  }
  rows.push([input.kind === 'enquiry' ? 'Enquiry about' : 'Type', esc(input.topic)]);
  if (input.item) rows.push([input.kind === 'notify' ? 'Waiting for' : 'Product', esc(input.item)]);
  rows.push(['Received', esc(received)]);

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${C.line};width:130px;vertical-align:top;font:600 11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${C.line};vertical-align:top;font:15px/1.5 Arial,Helvetica,sans-serif;color:${C.ink};">${value}</td>
        </tr>`,
    )
    .join('');

  const messageBlock = input.message
    ? `
        <tr><td colspan="2" style="padding:28px 0 8px;font:600 11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">Message</td></tr>
        <tr>
          <td colspan="2" style="background:${C.wash};border-left:3px solid ${C.gold};border-radius:6px;padding:18px 20px;font:15px/1.65 Arial,Helvetica,sans-serif;color:${C.ink};">${esc(input.message).replace(/\n/g, '<br>')}</td>
        </tr>`
    : '';

  const button = (href: string, label: string, primary: boolean) => `
    <td style="padding:0 10px 10px 0;">
      <a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:999px;border:1px solid ${C.gold};font:600 13px/1 Arial,Helvetica,sans-serif;letter-spacing:.4px;text-decoration:none;${
        primary ? `background:${C.mauve};color:#ffffff;` : `background:#ffffff;color:${C.mauve};`
      }">${label}</a>
    </td>`;

  const actions = [
    button(`mailto:${esc(input.email)}?subject=${replySubject}`, `Reply to ${esc(firstName)}`, true),
    wa ? button(wa, `WhatsApp ${esc(firstName)}`, false) : '',
    input.storedInInbox ? button(absoluteUrl('/admin'), 'Open admin inbox', false) : '',
  ].join('');

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(oneLine(input.message ?? `${input.topic} from ${who}`, 110))}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:16px;overflow:hidden;">
        <tr>
          <td align="center" style="background:${C.noir};padding:26px 24px 22px;">
            <img src="cid:${EMAIL_LOGO.cid}" width="150" height="100" alt="ÈLENOR" style="display:block;width:150px;height:auto;border:0;color:${C.gold};font:600 22px/1.2 Georgia,serif;letter-spacing:4px;text-align:center;">
          </td>
        </tr>
        <tr><td style="height:3px;background:${C.gold};line-height:3px;font-size:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:34px 36px 8px;">
            <p style="margin:0;font:600 11px/1.5 Arial,Helvetica,sans-serif;letter-spacing:2.4px;text-transform:uppercase;color:${C.gold};">${heading.eyebrow}</p>
            <h1 style="margin:10px 0 6px;font:400 28px/1.25 Georgia,'Times New Roman',serif;color:${C.ink};">${heading.title}</h1>
            <p style="margin:0;font:14px/1.6 Arial,Helvetica,sans-serif;color:${C.muted};">From <strong style="color:${C.ink};">${esc(who)}</strong> · ${esc(received)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 36px 6px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}${messageBlock}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 36px 18px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>${actions}</tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 36px 30px;border-top:1px solid ${C.line};font:12px/1.7 Arial,Helvetica,sans-serif;color:${C.muted};">
            Reference <strong style="color:${C.ink};">${esc(input.reference)}</strong>${
              input.storedInInbox ? ' · Also saved to the admin inbox.' : ''
            }<br>
            Sent automatically from the ${input.kind === 'newsletter' ? 'newsletter sign-up' : input.kind === 'notify' ? 'Notify me form' : 'contact form'} on
            <a href="${SITE.url}" style="color:${C.mauve};text-decoration:none;">${esc(SITE.url.replace(/^https?:\/\//, ''))}</a>. Replying to this email answers the visitor directly.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `${heading.eyebrow.toUpperCase()} — ${heading.title}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${stripTags(value)}`),
    ...(input.message ? ['', 'Message:', input.message] : []),
    '',
    `Reference: ${input.reference}${input.storedInInbox ? ' (also saved to the admin inbox)' : ''}`,
    `Reply to this email to answer ${who} directly.`,
  ].join('\n');

  return {
    subject,
    html,
    text,
    replyTo: { name: oneLine(input.name || input.email, 80), address: input.email },
  };
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}
