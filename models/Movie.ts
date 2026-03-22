import { ObjectId } from 'mongodb';

export interface IMovie {
  _id?: ObjectId;
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
  updatedAt: Date;
}

export interface IMovieCreate {
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
  featured?: boolean;
}

export interface IMovieUpdate {
  title?: string;
  slug?: string;
  poster?: string;
  backdrop?: string;
  description?: string;
  hls?: string;
  audioLanguages?: string[];
  quality?: string[];
  genre?: string[];
  year?: number;
  featured?: boolean;
}
