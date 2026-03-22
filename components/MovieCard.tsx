'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  priority?: boolean;
}

export const MovieCard = ({ movie, size = 'md', showInfo = true, priority = false }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-36 sm:w-40 md:w-44',
    md: 'w-40 sm:w-44 md:w-48',
    lg: 'w-48 sm:w-56 md:w-64',
  };

  return (
    <Link 
      href={`/movie/${movie.slug}`} 
      className={`${sizeClasses[size]} flex-shrink-0 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        )}
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className={`object-cover transition-all duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 224px"
          priority={priority}
          onLoad={() => setImageLoaded(true)}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 scale-0 group-hover:scale-100">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        
        <div className={`absolute top-2 left-2 flex flex-col gap-1 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          {movie.quality.slice(0, 1).map((q) => (
            <span key={q} className="badge-quality text-[10px] px-1.5 py-0.5">
              {q}
            </span>
          ))}
        </div>
        
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="text-sm font-bold text-white line-clamp-2 mb-1 leading-tight">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span>{movie.year}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <div className="flex gap-1">
              {movie.audioLanguages.slice(0, 2).map((lang) => (
                <span key={lang} className="text-gray-300">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      
      {showInfo && (
        <div className="mt-3 hidden md:block">
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{movie.year}</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <div className="flex gap-1">
              {movie.audioLanguages.slice(0, 2).map((lang) => (
                <span key={lang} className="text-xs text-gray-500">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};
