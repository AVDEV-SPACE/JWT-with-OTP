// app/api/admin/verify-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_session')?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'No session token found.' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET nu este setat în environment variables.');
        }

        const { payload } = await jwtVerify(token, secret);

        if (payload && typeof payload === 'object' && 'role' in payload && payload.role === 'admin') {
            return NextResponse.json({ success: true, message: 'Session valid.' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid session token.' }, { status: 401 });
        }
        
    } catch (error) {
        console.error('Error verifying session:', error.message);
        return NextResponse.json({ success: false, message: 'Error verifying session.' }, { status: 401 });
    }
}