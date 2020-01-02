import { GqlPost, Post, Context, GqlPicture, GqlUser, GqlComment } from '../models';
import { pictureResolvers } from './picture';
import { userResolvers } from './user';
import { commentResolvers } from './comment';

const key = 'posts';

export const postFieldResolvers = {
  Post: {
    picture(post: Post, _args: {}, { db }: Context): GqlPicture {
      return pictureResolvers.picture({}, { id: post.picture_id }, { db });
    },
    author(post: Post, _args: {}, { db }: Context): GqlUser {
      return userResolvers.user({}, { id: post.user_id }, { db });
    },
    likes(post: Post, _args: {}, { db }: Context): GqlUser[] {
      return post.likes_ids.map(
        (id: number): GqlUser => {
          return userResolvers.user({}, { id }, { db });
        }
      );
    },
    comments(post: Post, _args: {}, { db }: Context): GqlComment[] {
      return post.comments_ids.map(
        (id: number): GqlComment => {
          console.log(commentResolvers.comment({}, { id }, { db }));
          return commentResolvers.comment({}, { id }, { db });
        }
      );
    }
  }
};

export const postResolvers = {
  /** Gets all Posts */
  posts(_root: {}, { id }: GqlPost, { db }: Context): GqlPost[] {
    return db.get(key).value();
  },

  /** Gets a single Post by its id */
  post(_root: {}, { id }: GqlPost, { db }: Context): GqlPost {
    return db
      .get(key)
      .find({ id })
      .value();
  }
};
