import { Comment, Context, GqlUser, GqlComment, GqlPost } from '../models';
import { userQueries } from './user';
import { postQueries } from './post';

const key = 'comments';

export const commentFields = {
  Comment: {
    author(comment: Comment, _args: {}, ctx: Context): GqlUser {
      return userQueries.user({}, { id: comment.user_id }, ctx);
    },
    post(comment: Comment, _args: {}, ctx: Context): GqlPost {
      return postQueries.post({}, { id: comment.post_id }, ctx);
    }
  }
};

export const commentQueries = {
  /** Gets a single Comment by its id */
  comment(_root: {}, { id }: GqlComment, { db }: Context): GqlComment {
    return db
      .get(key)
      .find({ id })
      .value();
  },

  /** Gets all Comments from a Post */
  commentsByPost(_root: {}, { postId }: { postId: number }, { db }: Context): GqlComment[] {
    return db
      .get(key)
      .filter({ post_id: postId })
      .value();
  }
};
