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
    <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to right from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-xl transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/80 text-sm font-medium">
                Included with Prime
              </span>
              <span className="text-white/60 text-sm">
                {movie.year}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-2 leading-relaxed">
              {movie.description}
            </p>

            <div className="flex items-center gap-3 mb-8 text-sm text-gray-400">
              {movie.genre.slice(0, 3).join(' • ')}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/watch/${movie.slug}`}
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Link>

              <Link
                href={`/movie/${movie.slug}`}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 font-semibold text-sm hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
