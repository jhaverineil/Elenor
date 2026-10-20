import type { CartItem, CheckoutFormData, ApiResponse } from '@/types';

export interface PlaceOrderInput {
  customer: CheckoutFormData;
  items: CartItem[];
  total: number;
}

/**
 * Client-side service: sends order data to the API controller.
 * Abstracts the fetch call away from the View (checkout page).
 */
export async function placeOrder(
  input: PlaceOrderInput
): Promise<ApiResponse<{ orderId: string }>> {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    return { success: false, error: data.error ?? 'Something went wrong' };
  }

  return data;
}
