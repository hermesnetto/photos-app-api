import { Picture, GqlPicture, Context, GqlUser, MODEL_TYPES } from '../models';
import { userQueries } from './user';

const key = MODEL_TYPES.Pictures;

export const pictureFields = {
  Picture: {
    author(picture: Picture, _args: {}, ctx: Context): GqlUser {
      return userQueries.user({}, { id: picture.user_id }, ctx);
    }
  }
};

export const pictureQueries = {
  /** Gets a single Picture by its id */
  picture(_root: {}, { id }: GqlPicture, { db }: Context): GqlPicture {
    return db
      .get(key)
      .find({ id })
      .value();
  }
};
