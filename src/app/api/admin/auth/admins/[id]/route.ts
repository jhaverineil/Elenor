import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import { getAllAdmins, deleteAdminById } from '@/models/admin.model';

/**
 * Endpoint: DELETE /api/admin/auth/admins/[id]
 * Deletes an administrator account. Protected by admin session token.
 * Prevents self-deletion and deleting the last administrator.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = getAuthenticatedAdmin(req);
    if (!adminSession) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (adminSession.id === id) {
      return NextResponse.json(
        { message: 'cannot_delete_self' },
        { status: 400 }
      );
    }

    const admins = await getAllAdmins();

    // Prevent deleting the last administrator
    if (admins.length <= 1) {
      return NextResponse.json(
        { message: 'cannot_delete_last_admin' },
        { status: 400 }
      );
    }

    await deleteAdminById(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Delete admin API error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
