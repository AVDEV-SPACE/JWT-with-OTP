//! lib/auth.ts 
import { SignJWT, jwtVerify } from 'jose';

export async function generateToken(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, payload: null };
  }
}