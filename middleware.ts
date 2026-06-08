import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type JwtPayload = {
  role?: string;
  sub?: string;
  phone?: string;
};

async function verifyToken(token: string): Promise<JwtPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("scentiva_token")?.value;

    const isDashboardPage = pathname.startsWith("/dashboard");
    const isAdminPage = pathname.startsWith("/admin");
    const isAuthPage = pathname === "/signin" || pathname === "/signup" || pathname === "/verify-otp";
    const isProtected = isDashboardPage || isAdminPage;

    if (isProtected && !token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    let payload: JwtPayload | null = null;
    if (token) {
      payload = await verifyToken(token);
      if (isProtected && !payload) {
        const response = NextResponse.redirect(new URL("/signin", request.url));
        response.cookies.delete("scentiva_token");
        response.cookies.delete("scentiva_user");
        return response;
      }
    }

    if (isAdminPage && payload?.role?.toUpperCase() !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isAuthPage && payload) {
      const destination = payload.role?.toUpperCase() === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/signin", "/signup", "/verify-otp"],
};
