import { ObjectId } from 'mongodb';

export interface IContinueWatchingItem {
  movieSlug: string;
  currentTime: number;
  duration: number;
  updatedAt: Date;
}

export interface IWatchHistoryItem {
  movieSlug: string;
  lastWatched: Date;
  watchCount: number;
}

export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  continueWatching: IContinueWatchingItem[];
  favorites: string[];
  watchHistory: IWatchHistoryItem[];
  createdAt: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  name: string;
}

export interface IUserUpdate {
  name?: string;
  continueWatching?: IContinueWatchingItem[];
  favorites?: string[];
  watchHistory?: IWatchHistoryItem[];
}
