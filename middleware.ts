import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
    const accessToken = cookies.accessToken;
    console.log('Middleware Access Token', accessToken);

    const publicRoutes = [
        "/",
        "/auth/login",
        "/auth/register",
        "/auth/reset",
        "/catalogo",
        "/api/marketplace/surfboards",
        "/auth/new-verification"
    ];

    const authRoutes = [
        "/home",
        "/profile",
        "/dashboard",
    ];

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (accessToken && isPublicRoute && pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    if (!accessToken && isAuthRoute) {
        if (!pathname.startsWith('/auth/verify-email')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.*\\.).*)"],
};
