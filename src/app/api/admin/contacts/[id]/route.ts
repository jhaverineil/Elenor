import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import { deleteContactById } from '@/models/contact.model';

/**
 * Endpoint: DELETE /api/admin/contacts/[id]
 * Deletes a single contact submission by its ID. Protected by admin session token.
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
    await deleteContactById(id);
    
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Delete contact API error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
