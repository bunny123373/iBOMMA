export interface Movie {
  _id?: string;
  title: string;
  slug: string;
  poster: string;
  backdrop: string;
  description: string;
  hls: string;
  audioLanguages: string[];
  quality: string[];
  genre: string[];
  year: number;
  featured: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  continueWatching: ContinueWatchingItem[];
  favorites: string[];
  watchHistory: WatchHistoryItem[];
  createdAt: Date;
}

export interface ContinueWatchingItem {
  movieSlug: string;
  currentTime: number;
  duration: number;
  updatedAt: Date;
}

export interface WatchHistoryItem {
  movieSlug: string;
  lastWatched: Date;
  watchCount: number;
}

export interface SearchFilters {
  query?: string;
  language?: string;
  genre?: string;
}
