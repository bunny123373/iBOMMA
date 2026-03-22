'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/lib/types';

interface ContinueWatchingItem {
  movieSlug: string;
  poster?: string;
  title?: string;
  currentTime: number;
  duration: number;
}

export default function ProfilePage() {
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedProgress = localStorage.getItem('watchProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          const progressList = Object.entries(progress)
            .map(([slug, data]: [string, unknown]) => {
              const d = data as { currentTime: number; duration: number; updatedAt: string };
              return {
                movieSlug: slug,
                currentTime: d.currentTime,
                duration: d.duration,
              };
            })
            .filter((item) => item.currentTime > 0 && item.duration > 0)
            .slice(0, 10);
          setContinueWatching(progressList);
        }

        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          const favoriteSlugs = JSON.parse(savedFavorites);
          setFavorites(favoriteSlugs);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-mirror-darker pt-20 md:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center space-x-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-mirror-primary flex items-center justify-center">
            <span className="text-4xl font-bold text-white">U</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, User</h1>
            <p className="text-gray-400">Manage your watching preferences</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            <div>
              <div className="skeleton h-8 w-48 mb-4 rounded" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton w-64 h-40 rounded-xl flex-shrink-0" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {continueWatching.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Continue Watching</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {continueWatching.map((item) => (
                    <Link
                      key={item.movieSlug}
                      href={`/watch/${item.movieSlug}?t=${item.currentTime}`}
                      className="w-64 flex-shrink-0 group"
                    >
                      <div className="relative rounded-xl overflow-hidden">
                        <div className="aspect-[2/3] relative">
                          <Image
                            src={item.poster || '/placeholder.jpg'}
                            alt={item.title || 'Movie'}
                            fill
                            className="object-cover"
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
                              className="h-full bg-mirror-primary"
                              style={{ width: `${(item.currentTime / item.duration) * 100}%` }}
                            />
                          </div>
                          <div className="bg-black/80 p-3">
                            <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                            <p className="text-gray-400 text-xs mt-1">
                              {Math.floor((item.duration - item.currentTime) / 60)} min left
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">My List</h2>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favorites.map((movie) => (
                    <Link key={movie._id} href={`/movie/${movie.slug}`} className="group">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                        <Image
                          src={movie.poster}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-white font-medium line-clamp-1 group-hover:text-mirror-primary transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{movie.year}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-mirror-gray/30 rounded-xl border border-white/10">
                  <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-gray-400">Your list is empty</p>
                  <p className="text-gray-500 text-sm mt-2">Add movies to your list to watch later</p>
                  <Link href="/movies" className="inline-block mt-6 btn-primary">
                    Browse Movies
                  </Link>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
              <div className="bg-mirror-gray/30 rounded-xl border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 text-sm">user@watchmirror.com</p>
                  </div>
                  <button className="text-mirror-primary hover:underline text-sm">Change</button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-gray-400 text-sm">Manage your notification preferences</p>
                  </div>
                  <button className="text-mirror-primary hover:underline text-sm">Manage</button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Streaming Quality</p>
                    <p className="text-gray-400 text-sm">Auto (Recommended)</p>
                  </div>
                  <button className="text-mirror-primary hover:underline text-sm">Change</button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
