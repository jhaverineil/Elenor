import { NextResponse } from 'next/server';
import { getAdminByUsername } from '@/models/admin.model';
import { verifyPassword, signToken } from '@/lib/adminCrypto';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Endpoint: POST /api/admin/auth/login
 * Handles administrator authentication, validates hashed credentials,
 * and returns a secure session token.
 */
export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(2, 8).toUpperCase();
  console.log(`[${requestId}] 🔑 [Admin Auth] Login request started...`);

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      console.warn(`[${requestId}] ⚠️ [Admin Auth] Input validation failed:`, parsed.error.issues[0].message);
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    console.log(`[${requestId}] 🔍 [Admin Auth] Fetching admin record for username: "${username}"`);
    
    // Check Supabase connection variables at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    console.log(`[${requestId}] 🌐 [Admin Auth] Supabase URL configured: "${supabaseUrl ? supabaseUrl.substring(0, 25) + '...' : 'NONE/EMPTY'}"`);

    const admin = await getAdminByUsername(username);

    if (!admin) {
      console.warn(`[${requestId}] ❌ [Admin Auth] Authentication failed: Username "${username}" not found in database.`);
      return NextResponse.json(
        { message: 'invalid_credentials' },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] 👤 [Admin Auth] Admin found! Stored hash prefix: "${admin.password_hash.substring(0, 25)}..."`);
    
    console.log(`[${requestId}] 🔒 [Admin Auth] Verifying password...`);
    const isMatch = verifyPassword(password, admin.password_hash);
    if (!isMatch) {
      console.warn(`[${requestId}] ❌ [Admin Auth] Authentication failed: Password mismatch for username "${username}".`);
      return NextResponse.json(
        { message: 'invalid_credentials' },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] 🎟️ [Admin Auth] Password match! Signing session token...`);
    // Generate JWT token
    const token = signToken({ id: admin.id, username: admin.username });
    console.log(`[${requestId}] 🎉 [Admin Auth] Session token signed successfully. Admin login complete!`);

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error: any) {
    console.error(`[${requestId}] 🚨 [Admin Auth] Critical login error:`, error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

