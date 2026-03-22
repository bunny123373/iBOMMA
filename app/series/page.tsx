'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/types';

const genres = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];

export default function SeriesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== 'All') params.append('genre', selectedGenre);

        const res = await fetch(`/api/movies?${params}`);
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error('Error fetching series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-mirror-darker pt-20 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Series</h1>
            <p className="text-gray-400 mt-2">Coming soon - Full series library</p>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm text-gray-400 mb-2 block">Filter by Genre</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-green-600 text-white'
                    : 'bg-mirror-gray text-gray-300 hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mirror-gray flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Series Coming Soon</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            We are working on adding your favorite TV series and web shows. Stay tuned!
          </p>
          <Link href="/movies" className="btn-primary inline-block">
            Browse Movies Instead
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton w-full aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Movies You Might Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.slice(0, 10).map((movie) => (
                <Link key={movie._id} href={`/movie/${movie.slug}`} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white font-medium line-clamp-1 group-hover:text-mirror-primary transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{movie.year}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
