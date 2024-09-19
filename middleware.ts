// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));

    const accessToken = cookies.accessToken;

    // Definição das rotas públicas e autenticadas
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

    console.log('Cookies disponíveis middleware');

    if (!accessToken && isAuthRoute) {
        console.log('Redirecionando para /auth/login, accessToken não encontrado');
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (accessToken && isPublicRoute) {
        if (pathname === '/home') {
            return NextResponse.next();
        }
        console.log('Redirecionando para /home, accessToken encontrado');
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // Permitir o prosseguimento para a rota solicitada
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.*\\.).*)"], // Inclui todas as rotas, excluindo arquivos estáticos
};