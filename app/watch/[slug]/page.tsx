'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Movie } from '@/lib/types';

interface ContinueWatchingItem {
  movieSlug: string;
  currentTime: number;
  duration: number;
  updatedAt: Date;
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const startTime = parseInt(params.t as string) || 0;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialTime, setInitialTime] = useState(startTime);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, relatedRes] = await Promise.all([
          fetch(`/api/movies?slug=${slug}`),
          fetch(`/api/movies`),
        ]);

        const movieData = await movieRes.json();
        const relatedData = await relatedRes.json();

        if (movieData.movie) {
          setMovie(movieData.movie);
          
          if (startTime === 0) {
            const savedProgress = localStorage.getItem(`progress_${slug}`);
            if (savedProgress) {
              const progress = JSON.parse(savedProgress);
              setInitialTime(progress.currentTime || 0);
            }
          }

          const related = relatedData.movies
            ?.filter((m: Movie) => m.slug !== slug)
            .slice(0, 8) || [];
          setRelatedMovies(related);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, startTime, router]);

  const handleTimeUpdate = useCallback((time: number) => {
    if (movie && time > 0) {
      localStorage.setItem(`progress_${slug}`, JSON.stringify({
        currentTime: time,
        duration: 0,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [movie, slug]);

  const handleVideoEnded = useCallback(() => {
    localStorage.removeItem(`progress_${slug}`);
    const nextMovie = relatedMovies[0];
    if (nextMovie) {
      router.push(`/watch/${nextMovie.slug}`);
    }
  }, [relatedMovies, router, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mirror-primary" />
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <VideoPlayer
          movie={movie}
          onTimeUpdate={handleTimeUpdate}
          initialTime={initialTime}
          onEnded={handleVideoEnded}
        />

        <div className="px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-gray-300">{movie.year}</span>
                <span className="text-gray-500">•</span>
                {movie.audioLanguages.map((lang) => (
                  <span key={lang} className="badge badge-language">
                    {lang}
                  </span>
                ))}
                {movie.quality.map((q) => (
                  <span key={q} className="badge badge-quality">
                    {q}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g) => (
                  <span key={g} className="badge badge-genre">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">{movie.description}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href={`/movie/${movie.slug}`}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>More Info</span>
                </Link>

                <button className="btn-secondary flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add to List</span>
                </button>
              </div>
            </div>
          </div>

          {relatedMovies.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title">Up Next</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedMovies.map((relatedMovie) => (
                  <Link
                    key={relatedMovie._id}
                    href={`/watch/${relatedMovie.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={relatedMovie.poster}
                        alt={relatedMovie.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-mirror-primary transition-colors">
                      {relatedMovie.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{relatedMovie.year}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
