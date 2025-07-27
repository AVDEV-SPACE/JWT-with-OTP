// midedleware.ts
import { NextRequest, NextResponse } from 'next/server';
  import { jwtVerify } from 'jose';

  export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isAdminPath = path.startsWith('/admin');

    if (isAdminPath) {
      const token = request.cookies.get('admin_session')?.value;

      if (!token) {
        console.log('Middleware: Token lipsă. Redirecționez la /?admin=true');
        return NextResponse.redirect(new URL('/?admin=true', request.url));
      }

      try {

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET nu este setat în environment variables.');
        }

        const { payload } = await jwtVerify(token, secret);
        
        if (payload && typeof payload === 'object' && 'role' in payload && payload.role === 'admin') {
          console.log('Middleware: Token valid. Permitem accesul.', payload);
          return NextResponse.next();
        } else {
          console.log('Middleware: Token invalid sau rol incorect. Redirecționez și șterg cookie.');
          const response = NextResponse.redirect(new URL('/?admin=true', request.url));
          response.cookies.delete('admin_session');
          return response;
        }
      } catch (error) {
        console.error('Middleware: Eroare la verificarea token-ului:', error.message);
        const response = NextResponse.redirect(new URL('/?admin=true', request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ['/admin/:path*', '/admin'],
  };