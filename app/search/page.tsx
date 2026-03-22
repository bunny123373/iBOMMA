'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types';

const languages = ['All', 'Telugu', 'Tamil', 'Hindi', 'English', 'Malayalam', 'Kannada'];
const genres = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query && selectedLanguage === 'All' && selectedGenre === 'All') {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (selectedLanguage !== 'All') params.append('language', selectedLanguage);
        if (selectedGenre !== 'All') params.append('genre', selectedGenre);

        const res = await fetch(`/api/movies?${params}`);
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedLanguage, selectedGenre]);

  return (
    <div className="min-h-screen bg-mirror-darker pt-20 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Search</h1>

        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-mirror-gray border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-mirror-primary"
            />
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Language</label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-mirror-primary text-white'
                      : 'bg-mirror-gray text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Genre</label>
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
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton w-full aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">{movies.length} results found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
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
          </>
        ) : query.length >= 2 || selectedLanguage !== 'All' || selectedGenre !== 'All' ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No movies found matching your criteria</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Start typing to search for movies</p>
          </div>
        )}
      </div>
    </div>
  );
}
