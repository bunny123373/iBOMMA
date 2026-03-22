import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Movie } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const language = searchParams.get('language');
    const genre = searchParams.get('genre');
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured');

    const db = await getDb();
    const collection = db.collection('movies');

    let filter: Record<string, unknown> = {};

    if (slug) {
      filter.slug = slug;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }

    if (language) {
      filter.audioLanguages = language;
    }

    if (genre) {
      filter.genre = genre;
    }

    const movies = await collection.find(filter).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ movies }, { status: 200 });
  } catch (error) {
    console.error('GET /api/movies error:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
    console.error('POST /api/movies error:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
