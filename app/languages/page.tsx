'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/types';

const languages = [
  { name: 'Telugu', flag: '🇮🇳', description: 'Telugu cinema' },
  { name: 'Tamil', flag: '🇮🇳', description: 'Tamil cinema' },
  { name: 'Hindi', flag: '🇮🇳', description: 'Bollywood & Hindi cinema' },
  { name: 'English', flag: '🇬🇧', description: 'Hollywood & English cinema' },
  { name: 'Malayalam', flag: '🇮🇳', description: 'Malayalam cinema' },
  { name: 'Kannada', flag: '🇮🇳', description: 'Kannada cinema' },
];

export default function LanguagesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLanguage) {
      fetchMovies(selectedLanguage);
    } else {
      setMovies([]);
    }
  }, [selectedLanguage]);

  const fetchMovies = async (language: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?language=${language}`);
      const data = await res.json();
      setMovies(data.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mirror-darker pt-20 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Browse by Language</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {languages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => setSelectedLanguage(lang.name === selectedLanguage ? null : lang.name)}
              className={`p-6 rounded-xl text-center transition-all ${
                selectedLanguage === lang.name
                  ? 'bg-mirror-primary scale-105'
                  : 'bg-mirror-gray hover:bg-white/10'
              }`}
            >
              <span className="text-4xl mb-3 block">{lang.flag}</span>
              <h3 className="text-white font-semibold">{lang.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{lang.description}</p>
            </button>
          ))}
        </div>

        {selectedLanguage && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedLanguage} Movies
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="skeleton w-full aspect-[2/3] rounded-xl" />
                ))}
              </div>
            ) : movies.length > 0 ? (
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
            ) : (
              <div className="text-center py-12 bg-mirror-gray/30 rounded-xl border border-white/10">
                <p className="text-gray-400">No {selectedLanguage} movies available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
