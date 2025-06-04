//* middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const adminPaths = ['/admin', '/admin/(.*)'];
  const isAdminPath = adminPaths.some(p => path.match(new RegExp(`^${p}$`)));

  if (isAdminPath) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/?admin=true', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
      const { payload } = await jwtVerify(token, secret);
      
      if (payload && typeof payload === 'object' && 'role' in payload && payload.role === 'admin') {
        return NextResponse.next();
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/?admin=true', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};