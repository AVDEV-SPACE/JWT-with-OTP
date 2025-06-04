//* src/app/api/admin/verify-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {

  const headers = request.headers;
  console.log('Request headers:', Object.fromEntries(headers));
  const token = cookies().get('admin_session')?.value;
  console.log('Token primit în verify-session:', token);

  if (!token) {
    console.log('Nu s-a găsit token în cookie-uri');
    return NextResponse.json({ message: 'Neautorizat: Token lipsă' }, { status: 401 });
  }

  const jwtSecret = process.env.JWT_SECRET;
  console.log('JWT_SECRET folosit pentru verificare:', jwtSecret ? 'Setat' : 'Nesetat');

  try {
    const decoded = verify(token, jwtSecret || '');
    console.log('Token decodificat:', decoded);
    if (typeof decoded === 'object' && decoded.role === 'admin') {
      console.log('Token valid, rol admin confirmat');
      return NextResponse.json({ success: true });
    } else {
      console.log('Rolul nu este admin sau token invalid');
      return NextResponse.json({ message: 'Neautorizat: Rol invalid' }, { status: 401 });
    }
  } catch (error) {
    console.error('Eroare la verificarea sesiunii:', error);
    return NextResponse.json({ message: 'Eroare server' }, { status: 500 });
  }
}