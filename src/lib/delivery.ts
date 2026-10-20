import { after } from 'next/server';
import { createContact } from '@/models/contact.model';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isMailConfigured, sendStudioMail } from '@/lib/mailer';
import { submissionEmail, type SubmissionEmailInput } from '@/lib/emailTemplates';
import { forwardToAutomation } from '@/lib/automation';

export interface Submission {
  kind: SubmissionEmailInput['kind'];
  name: string;
  email: string;
  phone?: string;
  /** Stored in the inbox "Tag" column, e.g. "Product availability — Revive Serum". */
  tag: string;
  /** Plain topic for the email, e.g. "Product availability". */
  topic: string;
  item?: string;
  message: string;
}

export type DeliveryResult =
  | { ok: true; id: string; channels: ('inbox' | 'email')[] }
  | { ok: false; status: 500 | 503 };

/**
 * Delivers a visitor submission to every configured channel: the admin inbox
 * (Supabase) and the studio's email. The visitor is told it was received only
 * when at least one channel has accepted it.
 */
export async function deliverSubmission(s: Submission, requestId: string): Promise<DeliveryResult> {
  const inboxEnabled = isSupabaseConfigured;
  const mailEnabled = isMailConfigured();
  if (!inboxEnabled && !mailEnabled) {
    console.error(`[${requestId}] 🚨 [Delivery] Neither Supabase nor SMTP is configured`);
    return { ok: false, status: 503 };
  }

  const channels: ('inbox' | 'email')[] = [];
  let id: string | undefined;
  let receivedAt = new Date();

  if (inboxEnabled) {
    try {
      const saved = await createContact(s.name, s.email, s.phone || undefined, s.tag, s.message);
      id = saved.id;
      receivedAt = new Date(saved.createdAt);
      channels.push('inbox');
      console.log(`[${requestId}] ✅ [Delivery] Saved to inbox (ID: "${saved.id}")`);
    } catch (error) {
      console.error(`[${requestId}] 🚨 [Delivery] Inbox save failed:`, error);
    }
  }

  const reference = id ?? `ELN-${Date.now().toString(36).toUpperCase()}`;

  if (mailEnabled) {
    try {
      const messageId = await sendStudioMail(
        submissionEmail({
          kind: s.kind,
          name: s.kind === 'newsletter' ? undefined : s.name,
          email: s.email,
          phone: s.phone,
          topic: s.topic,
          item: s.item,
          message: s.kind === 'newsletter' ? undefined : s.message,
          reference,
          storedInInbox: channels.includes('inbox'),
          receivedAt,
        }),
      );
      channels.push('email');
      console.log(`[${requestId}] 📧 [Delivery] Emailed studio (${messageId})`);
    } catch (error) {
      console.error(`[${requestId}] 🚨 [Delivery] Email failed:`, error);
    }
  }

  if (channels.length === 0) return { ok: false, status: 500 };

  after(() =>
    forwardToAutomation(s.kind === 'newsletter' ? 'newsletter.subscribed' : 'inquiry.created', {
      id: reference,
      name: s.name,
      email: s.email,
      phone: s.phone ?? '',
      tag: s.tag,
      message: s.message,
      createdAt: receivedAt.toISOString(),
    }),
  );

  return { ok: true, id: reference, channels };
}
