import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check admin role protection
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login?error=Unauthorized", req.url));
      }
    }

    // Check dashboard customer protection
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/admin/login")) return true;
        if (pathname.startsWith("/admin")) return token?.role === "ADMIN";
        if (pathname.startsWith("/dashboard")) return !!token;
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "plateplay-secret-pilot-beta-key-2026",
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/((?!login).*)",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
