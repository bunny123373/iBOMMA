'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
}

export const MovieCard = ({ movie, size = 'md', showInfo = true }: MovieCardProps) => {
  const sizeClasses = {
    sm: 'w-32 md:w-40',
    md: 'w-44 md:w-56',
    lg: 'w-56 md:w-64',
  };

  const aspectRatios = {
    sm: 'aspect-[2/3]',
    md: 'aspect-[2/3]',
    lg: 'aspect-[2/3]',
  };

  return (
    <Link href={`/movie/${movie.slug}`} className={`${sizeClasses[size]} flex-shrink-0`}>
      <div className={`movie-card ${aspectRatios[size]}`}>
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 176px, 224px"
        />
        <div className="movie-overlay">
          {showInfo && (
            <div className="movie-info">
              <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-300 mb-2">{movie.year}</p>
              <div className="flex flex-wrap gap-1">
                {movie.audioLanguages.slice(0, 2).map((lang) => (
                  <span key={lang} className="badge badge-language text-[10px]">
                    {lang}
                  </span>
                ))}
                {movie.quality.slice(0, 1).map((q) => (
                  <span key={q} className="badge badge-quality text-[10px]">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {showInfo && (
        <div className="mt-2 hidden md:block">
          <h3 className="text-sm font-medium text-white line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-gray-400">{movie.year}</p>
        </div>
      )}
    </Link>
  );
};
