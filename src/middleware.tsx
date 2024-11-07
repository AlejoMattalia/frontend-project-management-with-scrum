import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    if (!token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (token && ['/auth/login', '/auth/register'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && ['/auth/login', '/auth/register'].includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/', '/auth/login', '/auth/register'],
};
