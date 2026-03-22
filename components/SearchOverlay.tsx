'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types';

interface SearchOverlayProps {
  onClose: () => void;
}

export const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (query.length < 2 && !selectedLanguage && !selectedGenre) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (selectedLanguage) params.append('language', selectedLanguage);
        if (selectedGenre) params.append('genre', selectedGenre);

        const res = await fetch(`/api/movies?${params}`);
        const data = await res.json();
        setResults(data.movies || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedLanguage, selectedGenre]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const languages = ['Telugu', 'Tamil', 'Hindi', 'English', 'Malayalam', 'Kannada'];
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];

  return (
    <div
      className="search-overlay animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Search WATCHMIRROR</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, shows, languages..."
            className="w-full bg-mirror-gray border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-mirror-primary"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="premium-select"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="premium-select"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mirror-primary" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((movie) => (
              <Link
                key={movie._id}
                href={`/movie/${movie.slug}`}
                onClick={onClose}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-medium text-sm line-clamp-1">{movie.title}</h3>
                <p className="text-gray-400 text-xs">{movie.year}</p>
              </Link>
            ))}
          </div>
        ) : query.length >= 2 || selectedLanguage || selectedGenre ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No movies found matching your criteria</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Start typing to search movies...</p>
          </div>
        )}
      </div>
    </div>
  );
};
