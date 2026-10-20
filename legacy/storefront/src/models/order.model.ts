import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, CartItem, CheckoutFormData } from '@/types';

export interface CreateOrderInput {
  customer: CheckoutFormData;
  items: CartItem[];
  total: number;
  userId?: string;
}

/**
 * Persist a new order and its line items to Supabase.
 * Returns the created order row or throws on error.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { customer, items, total, userId } = input;

  // 1. Insert order header
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId ?? null,
      customer_email: customer.email,
      customer_name: `${customer.firstName} ${customer.lastName}`,
      total_amount: total,
      status: 'pending',
      shipping_address: `${customer.address}, ${customer.city}, ${customer.postalCode}, ${customer.country}`,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? 'Failed to create order');
  }

  // 2. Insert order line items
  const orderItems: Omit<OrderItem, 'id'>[] = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    throw new Error(itemsError.message ?? 'Failed to save order items');
  }

  return order as Order;
}

/**
 * Fetch all orders for a given user ID.
 */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}
