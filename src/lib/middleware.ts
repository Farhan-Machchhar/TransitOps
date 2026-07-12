export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protect every application route except:
     * - Login
     * - Forgot Password
     * - Next.js internals
     * - Static assets
     */
    "/dashboard/:path*",
    "/fleet/:path*",
    "/drivers/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/fuel/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};