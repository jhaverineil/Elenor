import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import { getAllContacts, clearAllContacts } from '@/models/contact.model';

/**
 * Endpoint: GET /api/admin/contacts
 * Returns all contact submissions in the inbox. Protected by admin session token.
 */
export async function GET(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 8).toUpperCase();
  console.log(`[${requestId}] 📑 [Admin API] Requesting all contact submissions`);

  try {
    const adminSession = getAuthenticatedAdmin(req);
    if (!adminSession) {
      console.warn(`[${requestId}] ❌ [Admin API] Unauthorized access attempt (invalid/missing token)`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[${requestId}] 🔑 [Admin API] Authorized admin session for user: "${adminSession.username}"`);
    
    const contacts = await getAllContacts();
    console.log(`[${requestId}] ✅ [Admin API] Retrieved ${contacts.length} contact entries from Supabase`);
    
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error(`[${requestId}] 🚨 [Admin API] Error retrieving contacts:`, error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint: DELETE /api/admin/contacts
 * Clears all contact submissions in the inbox. Protected by admin session token.
 */
export async function DELETE(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 8).toUpperCase();
  console.log(`[${requestId}] 🗑️ [Admin API] Request to clear all contact submissions`);

  try {
    const adminSession = getAuthenticatedAdmin(req);
    if (!adminSession) {
      console.warn(`[${requestId}] ❌ [Admin API] Unauthorized deletion attempt (invalid/missing token)`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[${requestId}] 🔑 [Admin API] Authorized admin session for user: "${adminSession.username}"`);
    
    await clearAllContacts();
    console.log(`[${requestId}] ✅ [Admin API] Inbox cleared successfully!`);
    
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`[${requestId}] 🚨 [Admin API] Error clearing contacts:`, error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

