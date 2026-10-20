import { NextResponse } from 'next/server';
import { botCheck, clientIp, isRateLimited } from '@/lib/spamGuard';
import { fieldErrors, submissionSchema, topicLabel } from '@/lib/validation';
import { deliverSubmission } from '@/lib/delivery';
import { getProduct, getUpcoming } from '@/data/products';

/**
 * Endpoint: POST /api/inquiry
 * Public API for the contact form and "Notify me" requests. Each submission is
 * saved to the `contacts` table (the admin inbox — the `brand` column holds the
 * topic shown there as the tag) and emailed to the studio.
 */
export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(2, 8).toUpperCase();
  console.log(`[${requestId}] 📩 [Inquiry] New submission received`);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    console.warn(`[${requestId}] ⚠️ [Inquiry] Validation failed:`, errors);
    return NextResponse.json(
      { message: 'Please check the highlighted fields.', fieldErrors: errors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const blocked = botCheck(data);
  if (blocked) {
    console.warn(`[${requestId}] 🛡️ [Inquiry] Rejected by spam guard`);
    return NextResponse.json({ message: blocked }, { status: 422 });
  }

  if (isRateLimited(`inquiry:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    console.warn(`[${requestId}] 🛡️ [Inquiry] Rate limited`);
    return NextResponse.json(
      { message: 'You have sent several messages in a short time. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  let topic: string;
  let item: string | undefined;
  let message: string;
  if (data.kind === 'notify') {
    const piece = data.piece ? getUpcoming(data.piece) : undefined;
    topic = 'Notify me';
    item = piece?.name;
    message = `Please notify me when "${piece?.name ?? 'a forthcoming Elenor release'}" is available.`;
    if (data.note) message += `\n\nNote from visitor:\n${data.note}`;
  } else {
    topic = topicLabel(data.topic);
    item = data.product ? getProduct(data.product)?.name : undefined;
    message = data.message;
  }
  const tag = item ? `${topic} — ${item}` : topic;

  const result = await deliverSubmission(
    { kind: data.kind, name: data.name, email: data.email, phone: data.phone, tag, topic, item, message },
    requestId
  );

  if (!result.ok) {
    return NextResponse.json(
      {
        message:
          result.status === 503
            ? 'Our enquiry service is temporarily unavailable. Please try WhatsApp or try again later.'
            : 'We could not send your message just now. Please try again in a moment.',
      },
      { status: result.status }
    );
  }
  return NextResponse.json({ id: result.id }, { status: 201 });
}
