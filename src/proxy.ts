import nextAuthMiddleware from "next-auth/middleware";

export const proxy = nextAuthMiddleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/fleet/:path*",
    "/vehicles/:path*",
    "/drivers/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/fuel/:path*",
    "/fuel-expenses/:path*",
    "/reports/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};
