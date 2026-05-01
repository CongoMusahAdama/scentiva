import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    console.log(`[Middleware] Processing request for: ${pathname}`);
    
    const token = request.cookies.get('scentiva_token')?.value;
    const userStr = request.cookies.get('scentiva_user')?.value;

    // Paths that require authentication
    const isDashboardPage = pathname.startsWith('/dashboard');
    const isAdminPage = pathname.startsWith('/admin');
    const isAuthPage = pathname === '/signin' || pathname === '/signup' || pathname === '/verify-otp';

    if ((isDashboardPage || isAdminPage) && !token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (isAdminPage && userStr) {
      try {
        const decodedUser = decodeURIComponent(userStr);
        const user = JSON.parse(decodedUser);
        if (user.role?.toUpperCase() !== 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (e) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }
    }

    if (isAuthPage && token) {
       // User is already logged in, redirect away from auth pages
       try {
         const decodedUser = userStr ? decodeURIComponent(userStr) : null;
         const user = decodedUser ? JSON.parse(decodedUser) : null;
         if (user?.role?.toUpperCase() === 'ADMIN') {
           return NextResponse.redirect(new URL('/admin', request.url));
         }
         return NextResponse.redirect(new URL('/dashboard', request.url));
       } catch (e) {
         // If cookie is malformed, proceed to auth page (where it will likely be cleared/replaced)
         return NextResponse.next();
       }
    }

    return NextResponse.next();
  } catch (err) {
    console.error('[Middleware Error]:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/signin', '/signup', '/verify-otp'],
};
