import { GqlPicture, Context, GqlUser, User, MODEL_TYPES, MutationResult } from '../models';
import { pictureQueries } from './picture';

const key = MODEL_TYPES.Users;

export interface CreateUserInput {
  input: {
    email: string;
    password: string;
    name: string;
  };
}

export interface UpdateUserInput {
  input: {
    id: number;
    email?: string;
    password?: string;
    name?: string;
    description?: string;
    profile_picture_id?: number | null;
  };
}

export interface DeleteUserInput {
  input: {
    id: number;
  };
}

export const userFields = {
  User: {
    friends(user: User, _args: {}, ctx: Context): GqlUser[] {
      return user.friends_ids.map(
        (friendId: number): GqlUser => {
          return userQueries.user({}, { id: friendId }, ctx);
        }
      );
    },

    profile_picture(user: User, _args: {}, ctx: Context): GqlPicture {
      if (!user.profile_picture_id) {
        return {};
      }

      return pictureQueries.picture({}, { id: user.profile_picture_id }, ctx);
    }
  }
};

export const userQueries = {
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

export const userMutations = {
  /** Creates a new User */
  addUser(_root: {}, { input }: CreateUserInput, ctx: Context): MutationResult<GqlUser> {
    const { db, generateId, getMutationResult } = ctx;
    const { email, password, name } = input;
    const newUser = {
      email,
      password,
      name,
      id: generateId(key),
      description: '',
      profile_picture_id: null,
      friends_ids: []
    };

    db.get(key)
      .push(newUser)
      .write();

    return getMutationResult(true, 'User succesfully creates', newUser);
  },

  /** Updates a User */
  updateUser(_root: {}, { input }: UpdateUserInput, ctx: Context): MutationResult<GqlUser> {
    const { db, getMutationResult } = ctx;
    const { id, ...data } = input;
    const user = db.get(key).find({ id });

    if (!user.value()) {
      return getMutationResult(false, 'User not found!', {});
    }

    const updatedUser = user.assign(data);
    updatedUser.write();

    return getMutationResult(true, 'User succesfully updated!', updatedUser.value());
  },

  /** Deletes a User */
  deleteUser(_root: {}, { input }: DeleteUserInput, ctx: Context): MutationResult<{}> {
    const { db, getMutationResult } = ctx;
    const { id } = input;

    const users = db.get(key);

    if (!users.find({ id }).value()) {
      return getMutationResult(false, 'User not found!', {});
    }

    users.remove({ id }).write();

    return getMutationResult(true, 'User succesfully deleted!', {});
  }
};
