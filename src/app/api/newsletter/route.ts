import { NextResponse } from 'next/server';
import { botCheck, clientIp, isRateLimited } from '@/lib/spamGuard';
import { fieldErrors, newsletterSchema } from '@/lib/validation';
import { deliverSubmission } from '@/lib/delivery';

/**
 * Endpoint: POST /api/newsletter
 * "Letters from Elenor" sign-ups. Saved to the `contacts` table under the
 * Newsletter tag (visible and exportable in the admin inbox) and emailed to
 * the studio.
 */
export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(2, 8).toUpperCase();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Please check your email address.', fieldErrors: fieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const blocked = botCheck(parsed.data);
  if (blocked) return NextResponse.json({ message: blocked }, { status: 422 });

  if (isRateLimited(`newsletter:${clientIp(req)}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ message: 'Please try again in a few minutes.' }, { status: 429 });
  }

  const result = await deliverSubmission(
    {
      kind: 'newsletter',
      name: 'Newsletter subscriber',
      email: parsed.data.email,
      tag: 'Newsletter',
      topic: 'Newsletter',
      message: 'Please add me to Letters from Elenor.',
    },
    requestId
  );

  if (!result.ok) {
    return NextResponse.json(
      {
        message:
          result.status === 503
            ? 'Subscriptions are temporarily unavailable. Please try again later.'
            : 'We could not add you just now. Please try again in a moment.',
      },
      { status: result.status }
    );
  }
  return NextResponse.json({ id: result.id }, { status: 201 });
}
