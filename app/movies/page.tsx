'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/lib/types';

const languages = ['All', 'Telugu', 'Tamil', 'Hindi', 'English', 'Malayalam', 'Kannada'];
const genres = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

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

  return (
    <div className="min-h-screen bg-mirror-darker pt-20 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Movies</h1>

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

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="premium-select w-auto"
            >
              <option value="latest">Latest Added</option>
              <option value="year">Release Year</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton w-full aspect-[2/3] rounded-xl" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No movies found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
