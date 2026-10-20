import { supabase } from '@/lib/supabase';

export interface ContactEntry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  brand?: string | null; // Tag / Label
  message: string;
  created_at: string;
}

export interface ClientContactEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  brand: string;
  message: string;
  createdAt: string;
}

/**
 * Fetch all contact submissions in the inbox.
 */
export async function getAllContacts(): Promise<ClientContactEntry[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Transform keys to camelCase for the original frontend client
  return (data ?? []).map((entry) => ({
    id: entry.id,
    name: entry.name,
    email: entry.email,
    phone: entry.phone || '',
    brand: entry.brand || '',
    message: entry.message,
    createdAt: entry.created_at,
  }));
}

/**
 * Create a new visitor inquiry/contact submission.
 */
export async function createContact(
  name: string,
  email: string,
  phone?: string,
  brand?: string,
  message?: string
): Promise<ClientContactEntry> {
  const { data, error } = await supabase
    .from('contacts')
    .insert([
      {
        name,
        email,
        phone: phone || null,
        brand: brand || null,
        message: message || '',
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    brand: data.brand || '',
    message: data.message,
    createdAt: data.created_at,
  };
}

/**
 * Delete a single contact submission by its ID.
 */
export async function deleteContactById(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Wipe all contact submissions in the inbox.
 */
export async function clearAllContacts(): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Wipe all rows securely

  if (error) {
    throw new Error(error.message);
  }
}
