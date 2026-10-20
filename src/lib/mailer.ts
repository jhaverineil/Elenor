import nodemailer, { type Transporter } from 'nodemailer';
import { EMAIL_LOGO } from './emailLogo';

// ─── Studio email notifications ──────────────────────────────────────────────
// Sends a copy of every enquiry to the studio inbox over SMTP. Works with any
// provider: Gmail / Google Workspace (with an app password), Zoho, Resend,
// Brevo, SendGrid… Configure SMTP_USER and SMTP_PASS (plus SMTP_HOST/PORT for
// non-Gmail providers); ENQUIRY_NOTIFY_TO overrides the recipient.

export const STUDIO_INBOX = process.env.ENQUIRY_NOTIFY_TO || 'nilujilu303@gmail.com';

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

export interface StudioMail {
  subject: string;
  html: string;
  text: string;
  /** The visitor's address, so "Reply" in the inbox answers them directly. */
  replyTo?: { name: string; address: string };
}

export async function sendStudioMail(mail: StudioMail) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const info = await getTransporter().sendMail({
    from: { name: 'Èlenor Website', address: from },
    to: STUDIO_INBOX,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    // The logo travels inside the email (referenced as cid:… in the HTML), so
    // it shows even when the website is not reachable or remote images are blocked.
    attachments: [
      {
        filename: 'elenor-logo.png',
        content: Buffer.from(EMAIL_LOGO.base64, 'base64'),
        contentType: 'image/png',
        cid: EMAIL_LOGO.cid,
        contentDisposition: 'inline',
      },
    ],
  });
  return info.messageId;
}
