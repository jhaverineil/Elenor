import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import { getAllAdmins, createAdmin } from '@/models/admin.model';
import { hashPassword } from '@/lib/adminCrypto';
import { z } from 'zod';

const createAdminSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Endpoint: GET /api/admin/auth/admins
 * Returns a list of all administrators. Protected by admin session token.
 */
export async function GET(req: NextRequest) {
  try {
    const adminSession = getAuthenticatedAdmin(req);
    if (!adminSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const admins = await getAllAdmins();
    return NextResponse.json(admins);
  } catch (error: any) {
    console.error('Get admins API error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint: POST /api/admin/auth/admins
 * Creates a new administrator account. Protected by admin session token.
 */
export async function POST(req: NextRequest) {
  try {
    const adminSession = getAuthenticatedAdmin(req);
    if (!adminSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const passwordHash = hashPassword(password);

    try {
      const newAdmin = await createAdmin(username, passwordHash);
      return NextResponse.json(newAdmin, { status: 201 });
    } catch (e: any) {
      if (e.message === 'username_taken') {
        return NextResponse.json(
          { message: 'username_taken' },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (error: any) {
    console.error('Create admin API error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
