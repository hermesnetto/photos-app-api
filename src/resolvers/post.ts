import { GqlPost, Post, Context, GqlPicture, GqlUser, GqlComment, MODEL_TYPES } from '../models';
import { pictureQueries } from './picture';
import { userQueries } from './user';
import { commentQueries } from './comment';

const key = MODEL_TYPES.Posts;

export const postFields = {
  Post: {
    picture(post: Post, _args: {}, ctx: Context): GqlPicture {
      return pictureQueries.picture({}, { id: post.picture_id }, ctx);
    },
    author(post: Post, _args: {}, ctx: Context): GqlUser {
      return userQueries.user({}, { id: post.user_id }, ctx);
    },
    likes(post: Post, _args: {}, ctx: Context): GqlUser[] {
      return post.likes_ids.map(
        (id: number): GqlUser => {
          return userQueries.user({}, { id }, ctx);
        }
      );
    },
    comments(post: Post, _args: {}, ctx: Context): GqlComment[] {
      return post.comments_ids.map(
        (id: number): GqlComment => {
          console.log(commentQueries.comment({}, { id }, ctx));
          return commentQueries.comment({}, { id }, ctx);
        }
      );
    }
  }
};

export const postQueries = {
  /** Gets a single Post by its id */
  post(_root: {}, { id }: GqlPost, { db }: Context): GqlPost {
    return db
      .get(key)
      .find({ id })
      .value();
  },

  /** Gets all Posts */
  posts(_root: {}, { id }: GqlPost, { db }: Context): GqlPost[] {
    return db.get(key).value();
  },

  /** Gets all Posts from a User */
  postsByUser(_root: {}, { userId }: { userId: number }, { db }: Context): GqlPost[] {
    return db
      .get(key)
      .filter({ user_id: userId })
      .value();
  }
};
