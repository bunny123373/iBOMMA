import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getDb } from '@/lib/mongodb';
import { Movie } from '@/lib/types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'watchmirror-jwt-secret');

export const dynamic = 'force-dynamic';

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const collection = db.collection('movies');

    const movies = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ movies, count: movies.length }, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/movies error:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Omit<Movie, '_id' | 'createdAt' | 'updatedAt'> = await request.json();

    const db = await getDb();
    const collection = db.collection('movies');

    const existingMovie = await collection.findOne({ slug: body.slug });
    if (existingMovie) {
      return NextResponse.json({ error: 'Movie with this slug already exists' }, { status: 400 });
    }

    const movie = {
      ...body,
      featured: body.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(movie);

    return NextResponse.json({
      message: 'Movie created successfully',
      movie: { _id: result.insertedId, ...movie },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/movies error:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Partial<Movie> = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('movies');

    const result = await collection.findOneAndUpdate(
      { slug },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Movie updated successfully',
      movie: result,
    }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/admin/movies error:', error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('movies');

    const result = await collection.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Movie deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/admin/movies error:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
