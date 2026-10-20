import crypto from 'crypto';

const ITERATIONS = 10000;
const KEY_LEN = 32;
const DIGEST = 'sha256';

const DEV_FALLBACK_SECRET = 'elenor-luxury-admin-secret-fallback-key';

/**
 * Signing secret for admin session tokens. NEXTAUTH_SECRET is still honoured so
 * existing deployments keep working. The public fallback is development-only:
 * in production a missing secret disables admin sign-in instead of letting
 * anyone who has read this file forge a token.
 */
function getSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_JWT_SECRET is not set; admin sessions are disabled.');
  }
  return DEV_FALLBACK_SECRET;
}

/**
 * Hash a password using PBKDF2 with SHA-256.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
  return `pbkdf2:${ITERATIONS}:${salt}:${hash}`;
}

/**
 * Verify a password against a stored PBKDF2 hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];
    const hash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST).toString('hex');
    return hash === originalHash;
  } catch (e) {
    return false;
  }
}

interface TokenPayload {
  id: string;
  username: string;
  exp: number;
}

/**
 * Sign a lightweight JWT session token for administrators.
 */
export function signToken(payload: Omit<TokenPayload, 'exp'>, expiresInSeconds: number = 86400): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: TokenPayload = { ...payload, exp };
  
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  
  const hmac = crypto.createHmac('sha256', getSecret());
  hmac.update(`${header}.${payloadB64}`);
  const signature = hmac.digest('base64url');

  return `${header}.${payloadB64}.${signature}`;
}

/**
 * Verify an administrative session token and return its payload.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payloadB64, signature] = parts;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', getSecret());
    hmac.update(`${header}.${payloadB64}`);
    const expected = Buffer.from(hmac.digest('base64url'));
    const given = Buffer.from(signature);

    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
    
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload: TokenPayload = JSON.parse(payloadJson);
    
    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (e) {
    return null;
  }
}
