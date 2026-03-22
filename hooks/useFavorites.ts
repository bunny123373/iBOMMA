'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/lib/types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteSlugs');
    if (saved) {
      try {
        setFavoriteSlugs(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const addToFavorites = useCallback((movie: Movie) => {
    setFavoriteSlugs((prev) => {
      if (prev.includes(movie.slug)) return prev;
      const updated = [...prev, movie.slug];
      localStorage.setItem('favoriteSlugs', JSON.stringify(updated));
      return updated;
    });
    setFavorites((prev) => {
      if (prev.find((m) => m.slug === movie.slug)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromFavorites = useCallback((slug: string) => {
    setFavoriteSlugs((prev) => {
      const updated = prev.filter((s) => s !== slug);
      localStorage.setItem('favoriteSlugs', JSON.stringify(updated));
      return updated;
    });
    setFavorites((prev) => prev.filter((m) => m.slug !== slug));
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favoriteSlugs.includes(slug),
    [favoriteSlugs]
  );

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      if (isFavorite(movie.slug)) {
        removeFromFavorites(movie.slug);
      } else {
        addToFavorites(movie);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  return { favorites, favoriteSlugs, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite };
};
