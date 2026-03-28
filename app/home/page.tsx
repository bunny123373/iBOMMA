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
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] shadow-lg">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span className="text-white text-sm font-medium">Download</span>
            </div>
          </div>
        </div>
        {movie.quality.length > 0 && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">
              {movie.quality[0]}
            </span>
          </div>
        )}
        {movie.audioLanguages.length > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-medium bg-black/70 text-white px-1.5 py-0.5 rounded">
              {movie.audioLanguages[0]}
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 px-1">
        <h3 className="text-sm font-semibold text-white group-hover:text-[#00a8e1] transition-colors truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">{movie.year}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span className="text-xs text-gray-500">
            {movie.audioLanguages?.slice(0, 2).join(', ') || 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const movies = (await getMovies()) as Movie[];

  const teluguMovies = movies.filter((m) => m.audioLanguages?.includes('Telugu'));
  const tamilMovies = movies.filter((m) => m.audioLanguages?.includes('Tamil'));
  const hindiMovies = movies.filter((m) => m.audioLanguages?.includes('Hindi'));
  const englishMovies = movies.filter((m) => m.audioLanguages?.includes('English'));
  const malayalamMovies = movies.filter((m) => m.audioLanguages?.includes('Malayalam'));
  const kannadaMovies = movies.filter((m) => m.audioLanguages?.includes('Kannada'));
  const latestMovies = movies.slice(0, 20);

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 py-6 border-b border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            iBOMMA
          </h1>
          <p className="text-gray-400 text-sm">
            Download Latest Movies in HD Quality
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { label: 'All', count: movies.length },
            { label: 'Telugu', count: teluguMovies.length },
            { label: 'Tamil', count: tamilMovies.length },
            { label: 'Hindi', count: hindiMovies.length },
            { label: 'English', count: englishMovies.length },
            { label: 'Malayalam', count: malayalamMovies.length },
            { label: 'Kannada', count: kannadaMovies.length },
          ].map((cat) => (
            <a
              key={cat.label}
              href={`#${cat.label.toLowerCase()}`}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium rounded-md transition-colors border border-white/10 hover:border-white/20"
            >
              {cat.label} ({cat.count})
            </a>
          ))}
        </div>

        {latestMovies.length > 0 && (
          <section className="mb-10" id="latest">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00a8e1]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Latest Movies
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {latestMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {teluguMovies.length > 0 && (
          <section className="mb-10" id="telugu">
            <h2 className="text-xl font-bold text-white mb-4">Telugu Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {teluguMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {tamilMovies.length > 0 && (
          <section className="mb-10" id="tamil">
            <h2 className="text-xl font-bold text-white mb-4">Tamil Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {tamilMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {hindiMovies.length > 0 && (
          <section className="mb-10" id="hindi">
            <h2 className="text-xl font-bold text-white mb-4">Hindi Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {hindiMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {englishMovies.length > 0 && (
          <section className="mb-10" id="english">
            <h2 className="text-xl font-bold text-white mb-4">English Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {englishMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {malayalamMovies.length > 0 && (
          <section className="mb-10" id="malayalam">
            <h2 className="text-xl font-bold text-white mb-4">Malayalam Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {malayalamMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {kannadaMovies.length > 0 && (
          <section className="mb-10" id="kannada">
            <h2 className="text-xl font-bold text-white mb-4">Kannada Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {kannadaMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} iBOMMA - Download Movies for Free
          </p>
        </footer>
      </div>
    </div>
  );
}
