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
    <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover scale-110 transition-transform duration-[2000ms] ease-out"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 via-transparent to-transparent" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
      
      <div className="absolute top-1/4 left-0 right-0 bottom-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className={`max-w-3xl transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 backdrop-blur-sm rounded-md text-xs font-semibold text-white uppercase tracking-wider">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                Featured
              </span>
              {movie.audioLanguages.slice(0, 2).map((lang) => (
                <span key={lang} className="badge-language">
                  {lang}
                </span>
              ))}
              {movie.quality.slice(0, 1).map((q) => (
                <span key={q} className="badge-quality">
                  {q}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-3 max-w-2xl leading-relaxed">
              {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-8">
              {movie.genre.slice(0, 4).map((g) => (
                <span key={g} className="badge-genre text-xs">
                  {g}
                </span>
              ))}
              <span className="text-gray-400 text-sm flex items-center gap-1.5 ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {movie.year}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${movie.slug}`}
                className="group relative inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              >
                <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Now</span>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
              </Link>

              <Link
                href={`/movie/${movie.slug}`}
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>More Info</span>
              </Link>

              <button className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:scale-105">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-400 text-xs uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
