import { NextRequest, NextResponse } from "next/server";

const STUDIO_COOKIE_NAME = "inno_studio_session";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect studio routes (except login and logout)
  if (pathname.startsWith("/studio")) {
    // Allow login and logout pages without auth
    if (pathname === "/studio/login" || pathname === "/studio/logout") {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get(STUDIO_COOKIE_NAME);
    const hasSession = sessionCookie?.value === "1";

    if (!hasSession) {
      // Redirect to login page
      const loginUrl = new URL("/studio/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
