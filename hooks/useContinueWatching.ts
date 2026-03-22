'use client';

import { useState, useEffect, useCallback } from 'react';

interface ContinueWatchingItem {
  movieSlug: string;
  currentTime: number;
  duration: number;
  updatedAt: Date;
}

export const useContinueWatching = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('watchProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const itemsList = Object.entries(parsed)
          .map(([slug, data]: [string, unknown]) => {
            const d = data as { currentTime: number; duration: number };
            return {
              movieSlug: slug,
              currentTime: d.currentTime,
              duration: d.duration,
              updatedAt: new Date(),
            };
          })
          .filter((item) => item.currentTime > 0);
        setItems(itemsList);
      } catch (error) {
        console.error('Error loading continue watching:', error);
      }
    }
  }, []);

  const updateProgress = useCallback((slug: string, currentTime: number, duration: number) => {
    const saved = localStorage.getItem('watchProgress');
    const progress = saved ? JSON.parse(saved) : {};
    progress[slug] = { currentTime, duration, updatedAt: new Date().toISOString() };
    localStorage.setItem('watchProgress', JSON.stringify(progress));

    setItems((prev) => {
      const existing = prev.findIndex((item) => item.movieSlug === slug);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], currentTime, duration };
        return updated;
      }
      return [...prev, { movieSlug: slug, currentTime, duration, updatedAt: new Date() }];
    });
  }, []);

  const removeProgress = useCallback((slug: string) => {
    const saved = localStorage.getItem('watchProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      delete progress[slug];
      localStorage.setItem('watchProgress', JSON.stringify(progress));
      setItems((prev) => prev.filter((item) => item.movieSlug !== slug));
    }
  }, []);

  return { items, updateProgress, removeProgress };
};
