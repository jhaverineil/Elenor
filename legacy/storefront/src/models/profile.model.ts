import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

/**
 * Fetch a user profile by their auth user ID.
 */
export async function getProfileById(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as UserProfile;
}

/**
 * Create or update a user profile (upsert).
 */
export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to upsert profile');
  return data as UserProfile;
}
