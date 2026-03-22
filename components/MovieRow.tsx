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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 50);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 50);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-4 md:px-8 mb-5">
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold text-white transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        {seeAllLink && (
          <a
            href={seeAllLink}
            className="group flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-500 transition-all duration-300 mr-4"
          >
            <span>See All</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 hover:translate-x-0 shadow-2xl ${showLeftButton ? 'md:flex' : 'hidden'}`}
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie._id}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <MovieCard movie={movie} priority={index < 4} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 hover:translate-x-0 shadow-2xl ${showRightButton ? 'md:flex' : 'hidden'}`}
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity md:hidden" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity md:hidden" />
      </div>
    </section>
  );
};
