import { Comment, Context, GqlUser, GqlComment, GqlPost } from '../models';
import { userResolvers } from './user';
import { postResolvers } from './post';

const key = 'comments';

export const commentFieldResolvers = {
  Comment: {
    author(comment: Comment, _args: {}, { db }: Context): GqlUser {
      return userResolvers.user({}, { id: comment.user_id }, { db });
    },
    post(comment: Comment, _args: {}, { db }: Context): GqlPost {
      return postResolvers.post({}, { id: comment.post_id }, { db });
    }
  }
};

export const commentResolvers = {
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
