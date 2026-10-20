import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // ── Auth pages: redirect to home if already logged in ────────────────────
  const isAuthPage = pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/register');
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ── Checkout: must have items (checked via cart cookie/session) ───────────
  // NOTE: Cart is in localStorage (client-side), so we can only do a basic check.
  // A more robust solution would use a server-side session or cookie for cart.
  // This middleware protects the route from direct URL access with a soft redirect.
  if (pathname.startsWith('/checkout')) {
    // If no session and no cart cookie at all, redirect to cart page
    const cartCookie = request.cookies.get('elenor-cart');
    if (!cartCookie) {
      return NextResponse.redirect(new URL('/cart', request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to relevant routes
export const config = {
  matcher: [
    '/checkout',
    '/auth/signin',
    '/auth/register',
  ],
};
