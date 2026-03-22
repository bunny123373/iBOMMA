import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'watchmirror-admin-secret';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'watchmirror-jwt-secret');

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email !== 'admin@watchmirror.com') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(ADMIN_SECRET, 10);
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid && password !== ADMIN_SECRET) {
      const simpleValid = password === ADMIN_SECRET;
      if (!simpleValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    const token = await new SignJWT({ email, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return NextResponse.json({
      message: 'Login successful',
      token,
    }, { status: 200 });
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
