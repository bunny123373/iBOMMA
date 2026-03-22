'use client';

import { useRef, useState, useEffect } from 'react';
import { Movie } from '@/lib/types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  seeAllLink?: string;
}

export const MovieRow = ({ title, movies, seeAllLink }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 50);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 50);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-lg font-medium text-white">
          {title}
        </h2>
        {seeAllLink && (
          <a
            href={seeAllLink}
            className="flex items-center gap-1 text-sm text-[#00a8e1] hover:text-[#0092c7] transition-colors"
          >
            <span>See all</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-20 bg-[#0d0d0d]/90 hover:bg-[#0d0d0d] text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center w-12 ${showLeftButton ? 'md:flex' : 'hidden'}`}
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-20 bg-[#0d0d0d]/90 hover:bg-[#0d0d0d] text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center w-12 ${showRightButton ? 'md:flex' : 'hidden'}`}
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};
