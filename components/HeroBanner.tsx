'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types';

interface HeroBannerProps {
  movie: Movie;
}

export const HeroBanner = ({ movie }: HeroBannerProps) => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mirror-darker via-mirror-darker/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-mirror-darker via-transparent to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
        <div className="max-w-2xl animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <span className="badge badge-quality">4K</span>
            {movie.audioLanguages.slice(0, 2).map((lang) => (
              <span key={lang} className="badge badge-language">
                {lang}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {movie.title}
          </h1>

          <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-3">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {movie.genre.slice(0, 4).map((g) => (
              <span key={g} className="badge badge-genre">
                {g}
              </span>
            ))}
            <span className="text-gray-400 text-sm">{movie.year}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/watch/${movie.slug}`}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play Now</span>
            </Link>

            <Link
              href={`/movie/${movie.slug}`}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-mirror-darker to-transparent" />
    </section>
  );
};
