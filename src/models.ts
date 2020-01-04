import { LowdbSync } from 'lowdb';

/**
 * GraphQl Schema Types
 */
export interface GqlMedia {
  id: number;
  source: string;
  author?: GqlUser;
}

export interface GqlUser {
  id: number;
  email: string;
  name: string;
  media?: GqlMedia;
}

export interface GqlPost {
  id: number;
  title: string;
  author?: GqlUser;
  medias?: GqlMedia[];
}

export interface GqlComment {
  id: number;
  body: string;
  author?: GqlUser;
}

/**
 * Database Schema Types
 */
export interface DBMedia {
  id: number;
  source: string;
  user_id: number;
}

export interface DBUser {
  id: number;
  email: string;
  password: string;
  name: string;
  media_id: number | null;
}

export interface DBPost {
  id: number;
  title: string;
  user_id: number;
}

export interface DBComment {
  id: number;
  body: string;
  user_id: number;
  post_id: number;
}

export interface DBPostMedia {
  id: number;
  user_id: number;
  post_id: number;
  media_id: number;
}

/**
 * Database Related Types
 */
export enum MODEL_TYPES {
  User = 'users',
  Media = 'medias',
  Post = 'posts',
  Comment = 'comments',
  PostMedia = 'postMedias'
}

export interface DBSchema {
  users: DBUser[];
  medias: DBMedia[];
  posts: DBPost[];
  postMedias: DBPostMedia[];
  comments: DBComment[];
}

export type DB = LowdbSync<DBSchema>;

/**
 * GraphQl Related Types
 */
export interface Context {
  db: LowdbSync<DBSchema>;
  generateId: (type: MODEL_TYPES) => number;
  mutationResult<T>(success: boolean, message: string, data: T): MutationResult<T>;
}

export interface MutationResult<T> {
  success: boolean;
  message: string;
  data: T | null;
}
