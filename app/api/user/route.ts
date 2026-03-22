import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, continueWatching, favorites, watchHistory } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('users');

    const updateData: Record<string, unknown> = { email };

    if (continueWatching !== undefined) {
      updateData.continueWatching = continueWatching;
    }

    if (favorites !== undefined) {
      updateData.favorites = favorites;
    }

    if (watchHistory !== undefined) {
      updateData.watchHistory = watchHistory;
    }

    const result = await collection.findOneAndUpdate(
      { email },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({
      message: 'User data updated successfully',
      user: result,
    }, { status: 200 });
  } catch (error) {
    console.error('POST /api/user error:', error);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('users');

    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
