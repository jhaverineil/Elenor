import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

/**
 * Register a new user via Supabase Auth.
 */
export async function registerUser(
  email: string,
  password: string,
  fullName: string
): Promise<ApiResponse> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, message: 'Registration successful. Please verify your email.' };
}

/**
 * Sign in with email & password via Supabase Auth.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<ApiResponse> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
