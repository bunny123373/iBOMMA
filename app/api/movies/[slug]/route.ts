import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Movie } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDb();
    const collection = db.collection('movies');

    const movie = await collection.findOne({ slug });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ movie }, { status: 200 });
  } catch (error) {
    console.error('GET /api/movies/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body: Partial<Movie> = await request.json();

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
    console.error('PUT /api/movies/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDb();
    const collection = db.collection('movies');

    const result = await collection.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Movie deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/movies/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
