'use client';

import { useRef } from 'react';
import { Movie } from '@/lib/types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  seeAllLink?: string;
}

export const MovieRow = ({ title, movies, seeAllLink }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="section-title mb-0">{title}</h2>
        {seeAllLink && (
          <a
            href={seeAllLink}
            className="text-mirror-primary hover:text-red-400 text-sm font-medium mr-4"
          >
            See All
          </a>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};
