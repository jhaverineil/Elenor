import { NextRequest } from 'next/server';
import { verifyToken } from './adminCrypto';

/**
 * Parses the Authorization header and verifies the administrative session token.
 * Returns the decoded token payload on success, or null on failure.
 */
export function getAuthenticatedAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}
