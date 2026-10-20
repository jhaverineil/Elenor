import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder } from '@/models/order.model';

// ── Input validation schema ──────────────────────────────────────────────────
const CheckoutItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string(),
});

const CheckoutBodySchema = z.object({
  customer: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  items: z.array(CheckoutItemSchema).min(1),
  total: z.number().positive(),
  userId: z.string().optional(),
});

// ── Controller ───────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate input with Zod
    const parsed = CheckoutBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { customer, items, total, userId } = parsed.data;

    // 2. Save order to Supabase database (via Model layer)
    let orderId: string | null = null;
    try {
      const order = await createOrder({ customer, items, total, userId });
      orderId = order.id;
    } catch (dbError: any) {
      // DB failure is non-blocking for now (e.g. when Supabase keys are not set)
      console.error('[DB] Failed to save order:', dbError.message);
    }

    // 3. Trigger n8n automation webhook
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    if (N8N_WEBHOOK_URL) {
      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order.placed',
            data: { customer, items, total, orderId, orderDate: new Date().toISOString() },
          }),
        });
      } catch (webhookError) {
        console.error('[n8n] Failed to trigger webhook:', webhookError);
      }
    }

    // 4. Return success
    return NextResponse.json({
      success: true,
      message: 'Order processed successfully',
      data: { orderId: orderId ?? 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase() },
    });
  } catch (error) {
    console.error('[Checkout API] Unhandled error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
