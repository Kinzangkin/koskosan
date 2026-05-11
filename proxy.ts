import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/tenant/dashboard", request.url));
    }
  }

  // Protect /tenant routes
  if (pathname.startsWith("/tenant")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "TENANT" && token.role !== "GUEST") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from login/register
  if (pathname === "/login" || pathname === "/register") {
    if (token && token.role) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect");
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/tenant/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/tenant/:path*", "/login", "/register"],
};
