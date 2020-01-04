import {
  Context,
  MODEL_TYPES,
  MutationResult,
  DBPost,
  GqlMedia,
  GqlPost,
  DBPostMedia,
  GqlComment,
  DBComment
} from '../models';

import { mediaQueries } from './media';
import { commentQueries } from './comment';

interface CreatePostParams {
  input: {
    title: string;
    user_id: number;
    mediasSource: string[];
  };
}

interface GetPostParams {
  id: number;
}

interface DeletePostParams {
  input: {
    id: number;
  };
}

interface GetPostsByUserParams {
  authorId: number;
}

export const postFields = {
  Post: {
    medias(post: DBPost, _args: {}, ctx: Context): GqlMedia[] {
      const { db } = ctx;
      const mediasIds = db
        .get(MODEL_TYPES.PostMedia)
        .filter({ post_id: post.id })
        .value()
        .map(({ media_id }) => media_id);

      return mediasIds.map(
        (mediaId: number): GqlMedia => {
          return mediaQueries.media({}, { id: mediaId }, ctx);
        }
      );
    },

    comments(post: DBPost, _args: {}, ctx: Context): GqlComment[] {
      return commentQueries.commentsByPost({}, { postId: post.id }, ctx);
    }
  }
};

export const postQueries = {
  post(_: {}, { id }: GetPostParams, { db }: Context): GqlPost {
    return db
      .get(MODEL_TYPES.Post)
      .find({ id })
      .value();
  },

  postsByUser(_: {}, { authorId }: GetPostsByUserParams, { db }: Context): GqlPost[] {
    return db
      .get(MODEL_TYPES.Post)
      .filter({ user_id: authorId })
      .value();
  }
};

export const postMutations = {
  createPost(_: {}, { input }: CreatePostParams, ctx: Context): MutationResult<GqlPost> {
    const { db, mutationResult, generateId } = ctx;
    const { title, user_id, mediasSource } = input;

    const postId = generateId(MODEL_TYPES.Post);
    const postData: DBPost = { id: postId, user_id: user_id, title };

    db.get(MODEL_TYPES.Post)
      .push(postData)
      .write();

    mediasSource.forEach((source: string): void => {
      const postMediaId = generateId(MODEL_TYPES.PostMedia);
      const mediaId = generateId(MODEL_TYPES.Media);

      db.get(MODEL_TYPES.Media)
        .push({ id: mediaId, user_id: user_id, source })
        .write();

      db.get(MODEL_TYPES.PostMedia)
        .push({ id: postMediaId, user_id: user_id, post_id: postId, media_id: mediaId })
        .write();
    });

    return mutationResult(true, 'Post successfully created!', postData);
  },

  deletePost(_: {}, { input }: DeletePostParams, ctx: Context): MutationResult<null> {
    const { db, mutationResult } = ctx;
    const { id } = input;
    const post = db
      .get(MODEL_TYPES.Post)
      .find({ id })
      .value();

    if (!post) {
      return mutationResult(false, 'Post not found!', null);
    }

    db.get(MODEL_TYPES.PostMedia)
      .filter({ post_id: post.id })
      .value()
      .forEach(({ id, media_id }: DBPostMedia) => {
        db.get(MODEL_TYPES.Media)
          .remove({ id: media_id })
          .write();

        db.get(MODEL_TYPES.PostMedia)
          .remove({ id })
          .write();
      });

    db.get(MODEL_TYPES.Comment)
      .filter({ post_id: id })
      .value()
      .forEach(({ id }: DBComment) => {
        db.get(MODEL_TYPES.Comment)
          .remove({ id })
          .write();
      });

    db.get(MODEL_TYPES.Post)
      .remove({ id })
      .write();

    return mutationResult(true, 'Post successfully deleted!', null);
  }
};
