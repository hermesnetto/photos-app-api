import { Picture, GqlPicture, Context, GqlUser } from '../models';
import { userResolvers } from './user';

const key = 'pictures';

export const pictureFieldResolvers = {
  Picture: {
    author(picture: Picture, _args: {}, { db }: Context): GqlUser {
      return userResolvers.user({}, { id: picture.user_id }, { db });
    }
  }
};

export const pictureResolvers = {
  /** Gets a single Picture by its id */
  picture(_root: {}, { id }: GqlPicture, { db }: Context): GqlPicture {
    return db
      .get(key)
      .find({ id })
      .value();
  }
};
