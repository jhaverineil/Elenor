import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

/**
 * Fetch a single product by its ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Product;
}

/**
 * Fetch all products.
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

/**
 * Decrement stock quantity for a product after a purchase.
 */
export async function decrementStock(productId: string, quantity: number): Promise<void> {
  const { error } = await supabase.rpc('decrement_stock', {
    product_id: productId,
    amount: quantity,
  });

  if (error) throw new Error(error.message);
}
