// app/api/admin/verify-passkey/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { passkey } = await request.json();

    if (passkey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      return NextResponse.json({ message: "Invalid passkey" }, { status: 401 });
    }

    const token = await generateToken({ role: 'admin' });

cookies().set({
  name: 'admin_session',
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 28800, // 8 ore
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined // Folosește domain-ul generic
});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}