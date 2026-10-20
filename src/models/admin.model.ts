import { supabase } from '@/lib/supabase';

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

/**
 * Fetch an administrator by their username.
 */
export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('Error fetching admin by username:', error.message);
    return null;
  }
  return data as AdminUser;
}

/**
 * Fetch all administrators (excluding hashes from response for security).
 */
export async function getAllAdmins(): Promise<Omit<AdminUser, 'password_hash'>[]> {
  const { data, error } = await supabase
    .from('admins')
    .select('id, username, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  // Transform standard created_at into camelCase createdAt to match original frontend
  return (data ?? []).map(admin => ({
    id: admin.id,
    username: admin.username,
    createdAt: admin.created_at,
  })) as any;
}

/**
 * Create a new administrator account.
 */
export async function createAdmin(username: string, passwordHash: string): Promise<Omit<AdminUser, 'password_hash'>> {
  const { data, error } = await supabase
    .from('admins')
    .insert([{ username, password_hash: passwordHash }])
    .select('id, username, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('username_taken');
    }
    throw new Error(error.message);
  }

  return {
    id: data.id,
    username: data.username,
    createdAt: data.created_at,
  } as any;
}

/**
 * Delete an administrator by their ID.
 */
export async function deleteAdminById(id: string): Promise<void> {
  const { error } = await supabase
    .from('admins')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
