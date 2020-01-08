import { Context, MODEL_TYPES, MutationResult, DBComment, GqlComment, GqlUser } from '../models';
import { userQueries } from './user';

interface CreateCommentParams {
  input: {
    body: string;
    user_id: number;
    post_id: number;
  };
}

interface DeleteCommentParams {
  input: {
    id: number;
  };
}

interface GetCommentsByPostParams {
  postId: number;
}

export const commentFields = {
  Comment: {
    user(comment: DBComment, _args: {}, ctx: Context): GqlUser {
      return userQueries.user({}, { id: comment.user_id }, ctx);
    }
  }
};

export const commentQueries = {
  commentsByPost(_: {}, { postId }: GetCommentsByPostParams, { db }: Context): GqlComment[] {
    return db
      .get(MODEL_TYPES.Comment)
      .filter({ post_id: postId })
      .value();
  }
};

export const commentMutations = {
  createComment(_: {}, args: CreateCommentParams, ctx: Context): MutationResult<GqlComment | null> {
    const { db, mutationResult, generateId } = ctx;
    const { body, user_id, post_id } = args.input;

    if (
      !db
        .get(MODEL_TYPES.User)
        .find({ id: user_id })
        .value()
    ) {
      return mutationResult(true, 'User not found!', null);
    }

    if (
      !db
        .get(MODEL_TYPES.Post)
        .find({ id: post_id })
        .value()
    ) {
      return mutationResult(true, 'Post not found!', null);
    }

    const commentData = { id: generateId(MODEL_TYPES.Comment), user_id: user_id, body, post_id };

    db.get(MODEL_TYPES.Comment)
      .push(commentData)
      .write();

    delete commentData.user_id;
    delete commentData.post_id;

    return mutationResult(true, 'Comment successfully created!', commentData);
  },

  deleteComment(_: {}, args: DeleteCommentParams, ctx: Context): MutationResult<null> {
    const { db, mutationResult, generateId } = ctx;
    const { id } = args.input;

    if (
      !db
        .get(MODEL_TYPES.Comment)
        .find({ id })
        .value()
    ) {
      return mutationResult(true, 'Comment not found!', null);
    }

    db.get(MODEL_TYPES.Comment)
      .remove({ id })
      .write();

    return mutationResult(true, 'Comment successfully deleted!', null);
  }
};
