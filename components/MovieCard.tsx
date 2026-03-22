'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
}

export const MovieCard = ({ movie, size = 'md', priority = false }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-32 sm:w-36',
    md: 'w-36 sm:w-40 md:w-44',
    lg: 'w-44 sm:w-48 md:w-52',
  };

  return (
    <Link 
      href={`/movie/${movie.slug}`} 
      className={`${sizeClasses[size]} flex-shrink-0 group block`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a1a]">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
          sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
          priority={priority}
        />
        
        {isHovered && (
          <>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
        
        {movie.quality.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-medium bg-[#00a8e1] text-white px-1.5 py-0.5 rounded">
              {movie.quality[0]}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white group-hover:text-[#00a8e1] transition-colors truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-gray-500">{movie.year}</span>
          {movie.audioLanguages.length > 0 && (
            <>
              <span className="w-0.5 h-0.5 bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-500 truncate max-w-[60px]">
                {movie.audioLanguages[0]}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
