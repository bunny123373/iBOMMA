'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MovieCard } from '@/components/MovieCard';
import { MovieGridSkeleton } from '@/components/Skeleton';
import { Movie } from '@/lib/types';

const languages = [
  { id: 'All', label: 'All', icon: '🌐' },
  { id: 'Telugu', label: 'Telugu', icon: '🎬' },
  { id: 'Tamil', label: 'Tamil', icon: '🎭' },
  { id: 'Hindi', label: 'Hindi', icon: '🎥' },
  { id: 'English', label: 'English', icon: '🎬' },
  { id: 'Malayalam', label: 'Malayalam', icon: '🎞️' },
  { id: 'Kannada', label: 'Kannada', icon: '🎬' },
];

const genres = [
  { id: 'All', label: 'All Genres' },
  { id: 'Action', label: 'Action' },
  { id: 'Drama', label: 'Drama' },
  { id: 'Comedy', label: 'Comedy' },
  { id: 'Thriller', label: 'Thriller' },
  { id: 'Romance', label: 'Romance' },
  { id: 'Horror', label: 'Horror' },
  { id: 'Sci-Fi', label: 'Sci-Fi' },
];

const sortOptions = [
  { id: 'latest', label: 'Latest Added' },
  { id: 'year', label: 'Release Year' },
  { id: 'title', label: 'Title A-Z' },
];

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const langParam = searchParams.get('language');
    if (langParam) {
      setSelectedLanguage(langParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLanguage !== 'All') params.append('language', selectedLanguage);
        if (selectedGenre !== 'All') params.append('genre', selectedGenre);

        const res = await fetch(`/api/movies?${params}`);
        const data = await res.json();
        
        let sortedMovies = data.movies || [];
        
        if (sortBy === 'latest') {
          sortedMovies = sortedMovies.sort((a: Movie, b: Movie) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortBy === 'year') {
          sortedMovies = sortedMovies.sort((a: Movie, b: Movie) => b.year - a.year);
        } else if (sortBy === 'title') {
          sortedMovies = sortedMovies.sort((a: Movie, b: Movie) => 
            a.title.localeCompare(b.title)
          );
        }

        setMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedLanguage, selectedGenre, sortBy]);

  const updateURL = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-20 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Browse Movies
            </span>
          </h1>
          <p className="text-gray-400">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} available
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 md:hidden w-full py-3 px-4 bg-gray-800/80 border border-white/10 rounded-lg text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters & Sort
          </button>

          <div className={`flex flex-col sm:flex-row gap-4 w-full md:w-auto ${showFilters ? 'flex' : 'hidden md:flex'}`}>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage(lang.id);
                    updateURL('language', lang.id);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedLanguage === lang.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-white/5'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`flex items-center gap-3 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-800/80 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className={`mb-6 overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96' : 'max-h-0 md:max-h-96'}`}>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedGenre === genre.id
                    ? 'bg-emerald-600/90 text-white backdrop-blur-sm'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-white/5'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <MovieGridSkeleton count={12} />
        ) : movies.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
              {selectedLanguage !== 'All' && ` in ${selectedLanguage}`}
              {selectedGenre !== 'All' && ` • ${selectedGenre}`}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {movies.map((movie, index) => (
                <div
                  key={movie._id}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MovieCard movie={movie} priority={index < 6} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setSelectedLanguage('All');
                setSelectedGenre('All');
              }}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
