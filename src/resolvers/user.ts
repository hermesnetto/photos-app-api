import { GqlPicture, Context, GqlUser, GqlPost, User } from '../models';
import { pictureResolvers } from './picture';
import { postResolvers } from './post';

const key = 'users';

export const userFieldResolvers = {
  User: {
    posts(user: User, _args: {}, { db }: Context): GqlPost[] {
      return user.posts_ids.map(
        (postId: number): GqlPost => {
          return postResolvers.post({}, { id: postId }, { db });
        }
      );
    },
    friends(user: User, _args: {}, { db }: Context): GqlUser[] {
      return user.friends_ids.map(
        (friendId: number): GqlUser => {
          return userResolvers.user({}, { id: friendId }, { db });
        }
      );
    },
    profile_picture(user: User, _args: {}, { db }: Context): GqlPicture {
      return pictureResolvers.picture({}, { id: user.profile_picture_id }, { db });
    }
  }
};

export const userResolvers = {
  /** Gets a single User by its id */
  user(_root: {}, { id }: GqlUser, { db }: Context): GqlUser {
    return db
      .get(key)
      .find({ id })
      .value();
  },

  /** Gets all friends of a User */
  userFriends(_root: {}, { userId }: { userId: number }, { db }: Context): GqlUser[] {
    const user = db
      .get(key)
      .find({ id: userId })
      .value();

    return db
      .get(key)
      .filter(({ id }: User): boolean => {
        return user.friends_ids.includes(id);
      })
      .value();
  }
};
