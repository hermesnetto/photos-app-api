import { LowdbSync } from 'lowdb';

/** Database related types */
export enum MODEL_TYPES {
  Users = 'users',
  Pictures = 'pictures',
  Posts = 'posts',
  Comments = 'comments'
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  description: string;
  profile_picture_id: number | null;
  friends_ids: number[];
}

export interface Picture {
  id: number;
  source: string;
  user_id: number;
}

export interface Post {
  id: number;
  title: string;
  picture_id: number;
  user_id: number;
  likes_ids: number[];
  comments_ids: number[];
}

export interface Comment {
  id: number;
  body: string;
  post_id: number;
  user_id: number;
}

export interface DBSchema {
  users: User[];
  posts: Post[];
  pictures: Picture[];
  comments: Comment[];
}

/** GraphQL related types */
export interface GqlUser {
  id?: number;
  email?: string;
  password?: string;
  user?: User;
  name?: string;
  description?: string;
  profile_picture?: GqlPicture;
  friends?: GqlUser[];
}

export interface GqlPicture {
  id?: number;
  source?: string;
  author?: GqlUser;
}

export interface GqlPost {
  id?: number;
  title?: string;
  picture?: GqlPicture;
  author?: GqlUser;
  likes?: [GqlUser];
  comments?: [GqlComment];
}

export interface GqlComment {
  id?: number;
  body?: string;
  post?: Post;
  author?: GqlUser;
}

export interface Context {
  db: LowdbSync<DBSchema>;
  generateId: (type: MODEL_TYPES) => number;
  getMutationResult<T>(status: boolean, message: string, data: T): MutationResult<T>;
}

export type DB = LowdbSync<DBSchema>;

export interface MutationResult<T> {
  status: boolean;
  message: string;
  data: T;
}
