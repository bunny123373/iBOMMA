'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ContinueWatchingCardProps {
  slug: string;
  poster: string;
  title: string;
  currentTime: number;
  duration: number;
}

export const ContinueWatchingCard = ({
  slug,
  poster,
  title,
  currentTime,
  duration,
}: ContinueWatchingCardProps) => {
  const progress = (currentTime / duration) * 100;

  return (
    <Link href={`/watch/${slug}?t=${currentTime}`} className="w-64 flex-shrink-0">
      <div className="relative rounded-xl overflow-hidden group">
        <div className="aspect-[2/3] relative">
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gray-600">
            <div
              className="h-full bg-mirror-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="bg-black/80 p-3">
            <h3 className="text-white font-medium text-sm line-clamp-1">{title}</h3>
            <p className="text-gray-400 text-xs mt-1">
              {Math.floor((duration - currentTime) / 60)} min left
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
