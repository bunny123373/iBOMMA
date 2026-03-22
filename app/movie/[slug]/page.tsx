import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { MovieRow } from '@/components/MovieRow';
import { Movie } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getMovie(slug: string) {
  try {
    const db = await getDb();
    const collection = db.collection('movies');
    const movie = await collection.findOne({ slug });
    return movie;
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    return null;
  }
}

async function getRelatedMovies(genre: string[], excludeSlug: string) {
  try {
    const db = await getDb();
    const collection = db.collection('movies');
    const movies = await collection
      .find({ genre: { $in: genre }, slug: { $ne: excludeSlug } })
      .limit(10)
      .toArray();
    return movies;
  } catch (error) {
    console.error('Failed to fetch related movies:', error);
    return [];
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    notFound();
  }

  const relatedMovies = await getRelatedMovies(movie.genre, slug);

  return (
    <div className="min-h-screen bg-mirror-darker">
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mirror-darker via-mirror-darker/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-mirror-darker via-transparent to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-80 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="w-64 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-gray-300">{movie.year}</span>
              <span className="text-gray-500">•</span>
              {movie.audioLanguages.map((lang: string) => (
                <span key={lang} className="badge badge-language">
                  {lang}
                </span>
              ))}
              {movie.quality.map((q: string) => (
                <span key={q} className="badge badge-quality">
                  {q}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g: string) => (
                <span key={g} className="badge badge-genre">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${movie.slug}`}
                className="btn-primary flex items-center space-x-2 text-lg px-10 py-4"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play Now</span>
              </Link>

              <button className="btn-secondary flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add to List</span>
              </button>

              <button className="btn-secondary flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            <div className="mt-10 p-6 bg-mirror-gray/50 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-4">Movie Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Audio Languages</p>
                  <p className="text-white mt-1">{movie.audioLanguages.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400">Quality</p>
                  <p className="text-white mt-1">{movie.quality.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400">Genres</p>
                  <p className="text-white mt-1">{movie.genre.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400">Release Year</p>
                  <p className="text-white mt-1">{movie.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <div className="mt-12">
            <MovieRow title="More Like This" movies={relatedMovies as unknown as Movie[]} />
          </div>
        )}
      </div>
    </div>
  );
}
