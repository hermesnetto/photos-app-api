import { Context, MODEL_TYPES, DBMedia, GqlUser } from '../models';
import { userQueries } from './user';

interface GetMediaParams {
  id: number;
}

export interface GqlMedia {
  id: number;
  source: string;
}

export const mediaFields = {
  Media: {
    author(media: DBMedia, _args: {}, ctx: Context): GqlUser {
      return userQueries.user({}, { id: media.user_id }, ctx);
    }
  }
};

export const mediaQueries = {
  media(_: {}, { id }: GetMediaParams, { db }: Context): GqlMedia {
    return db
      .get(MODEL_TYPES.Media)
      .find({ id })
      .value();
  }
};

export const mediaMutations = {};
