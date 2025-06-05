// app/api/admin/verify-passkey/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        const { passkey } = await request.json();

        // Asigură-te că JWT_SECRET este setat
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET nu este setat în environment variables.");
            return NextResponse.json({ success: false, message: "Eroare de configurare server." }, { status: 500 });
        }

        console.log('Verify-passkey: JWT_SECRET (first char, for debugging):', process.env.JWT_SECRET[0]); // Log doar primul caracter
        // NU loga întregul secret în producție!

        if (passkey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            return NextResponse.json({ success: false, message: "Passkey invalid." }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Elimină fallback-ul
        const token = await new SignJWT({ role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('8h')
            .sign(secret);

        const response = NextResponse.json({ success: true, message: "Passkey verified." }, { status: 200 });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure: true doar în producție
            sameSite: 'Lax' as const, // Schimbă la 'Lax' implicit.
                                     // Dacă ai nevoie neapărat de 'None', asigură-te că Next.js/jose
                                     // recunoaște tipul, dar 'Lax' este mai sigur și des suficient.
                                     // Dacă eroarea de tip persistă la 'None' chiar și cu 'secure: true',
                                     // și nu poți actualiza Next.js, 'Lax' este o alternativă bună
                                     // pentru a merge mai departe.
            path: '/',
            maxAge: 60 * 60 * 8,
        };

        // For debugging specific cookie options in console if needed:
        // console.log('Setting cookie with options:', cookieOptions);

        response.cookies.set('admin_session', token, cookieOptions);

        return response;

    } catch (error) {
        console.error("Error verifying passkey:", error);
        return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
    }
}