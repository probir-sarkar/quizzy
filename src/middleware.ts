import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple password protection for admin routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route
  if (pathname.startsWith("/admin")) {
    // Exclude the login page from protection
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for the admin session cookie
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Verify the session matches the expected password
    const expectedSession = Buffer.from(process.env.ADMIN_PASSWORD || "admin123").toString("base64");
    if (adminSession.value !== expectedSession) {
      // Invalid session, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
