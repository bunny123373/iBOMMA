'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Movie } from '@/lib/types';

interface HeroBannerProps {
  movie: Movie;
}

export const HeroBanner = ({ movie }: HeroBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0d0d0d]/90 to-transparent" />

      <div className="absolute top-1/3 left-0 right-0 -translate-y-1/2 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-2xl transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Included with Prime
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="text-white/80 text-sm">
                {movie.year}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-2 max-w-xl leading-relaxed">
              {movie.description}
            </p>

            <div className="flex items-center gap-3 mb-8 text-sm text-gray-400">
              {movie.genre.slice(0, 3).map((g, i) => (
                <span key={g}>
                  {g}{i < Math.min(movie.genre.length, 3) - 1 && ' •'}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/watch/${movie.slug}`}
                className="group inline-flex items-center gap-2 bg-[#00a8e1] hover:bg-[#0092c7] text-white px-6 py-3 rounded-sm font-semibold text-sm transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Now</span>
              </Link>

              <Link
                href={`/movie/${movie.slug}`}
                className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-sm font-medium text-sm transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>More Info</span>
              </Link>

              <button className="group inline-flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-sm transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
    </section>
  );
};
