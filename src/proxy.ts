import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function proxy(req) {
    // Optional: Add custom authorization logic here if needed
    // e.g., if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'ADMIN') { return NextResponse.redirect(...) }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Requires a valid token to proceed
    },
    pages: {
      signIn: '/login', // Redirect to the custom login page if unauthorized
    },
  }
);

export const config = {
  matcher: [
    // Protect all dashboard routes
    '/dashboard/:path*',
    '/vehicles/:path*',
    '/drivers/:path*',
    '/trips/:path*',
  ],
};
