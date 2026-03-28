import { getDb } from '@/lib/mongodb';
import Link from 'next/link';
import Image from 'next/image';
import { sampleMovies } from '@/lib/sampleData';
import { Movie } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

async function getMovies() {
  try {
    const db = await getDb();
    const collection = db.collection('movies');
    const movies = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return movies.length > 0 ? movies : sampleMovies;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return sampleMovies;
  }
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/download/${movie.slug}`} className="group block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a1a]">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        {movie.quality.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-medium bg-[#00a8e1] text-white px-1.5 py-0.5 rounded">
              {movie.quality[0]}
            </span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white group-hover:text-[#00a8e1] transition-colors truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-gray-500">{movie.year}</span>
          {movie.audioLanguages.length > 0 && (
            <>
              <span className="w-0.5 h-0.5 bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-500">{movie.audioLanguages[0]}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const movies = (await getMovies()) as Movie[];

  const trendingMovies = movies.slice(0, 12);
  const latestMovies = movies.slice(0, 20);
  const teluguMovies = movies.filter((m) => m.audioLanguages?.includes('Telugu')).slice(0, 12);
  const tamilMovies = movies.filter((m) => m.audioLanguages?.includes('Tamil')).slice(0, 12);
  const hindiMovies = movies.filter((m) => m.audioLanguages?.includes('Hindi')).slice(0, 12);
  const englishMovies = movies.filter((m) => m.audioLanguages?.includes('English')).slice(0, 12);

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Movies & TV Shows
          </h1>
          <p className="text-gray-400 text-sm">
            {movies.length} titles available
          </p>
        </div>

        {trendingMovies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-white mb-4">Trending Now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {latestMovies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-white mb-4">Latest</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {latestMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {teluguMovies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-white mb-4">Telugu</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {teluguMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {tamilMovies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-white mb-4">Tamil</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tamilMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {hindiMovies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-white mb-4">Hindi</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {hindiMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {englishMovies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-white mb-4">English</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {englishMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
