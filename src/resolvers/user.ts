import { Context, MODEL_TYPES, MutationResult, DBUser, GqlUser, GqlMedia } from '../models';
import { mediaQueries } from './media';

interface CreateUserParams {
  input: {
    email: string;
    password: string;
    name: string;
  };
}

interface UpdateUserParams {
  input: {
    id: number;
    name: string;
    mediaSource: string;
  };
}

interface UpdateDBUserParams {
  name: string;
  media_id?: number;
}

interface GetUserParams {
  id: number;
}

export const userFields = {
  User: {
    media(user: DBUser, _args: {}, ctx: Context): GqlMedia | {} {
      if (!user.media_id) return {};
      return mediaQueries.media({}, { id: user.media_id }, ctx);
    }
  }
};

export const userQueries = {
  user(_: {}, { id }: GetUserParams, { db }: Context): GqlUser {
    return db
      .get(MODEL_TYPES.User)
      .find({ id })
      .value();
  }
};

export const userMutations = {
  createUser(_: {}, { input }: CreateUserParams, ctx: Context): MutationResult<GqlUser> {
    const { db, mutationResult, generateId } = ctx;
    const { email, password, name } = input;

    const userData = { id: generateId(MODEL_TYPES.User), email, password, name, media_id: null };

    db.get(MODEL_TYPES.User)
      .push(userData)
      .write();

    delete userData.password;

    return mutationResult(true, 'User successfully created!', userData);
  },

  updateUser(_: {}, { input }: UpdateUserParams, ctx: Context): MutationResult<GqlUser> {
    const { db, mutationResult, generateId } = ctx;
    const { id, name, mediaSource } = input;

    const user = db.get(MODEL_TYPES.User).find({ id });
    const userData: UpdateDBUserParams = { name };

    if (mediaSource) {
      const currentMediaId = user.value().media_id;

      if (currentMediaId) {
        db.get(MODEL_TYPES.Media)
          .find()
          .assign({ source: mediaSource })
          .write();
      } else {
        const mediaId = generateId(MODEL_TYPES.Media);

        db.get(MODEL_TYPES.Media)
          .push({ id: mediaId, user_id: id, source: mediaSource })
          .write();

        userData.media_id = mediaId;
      }
    }

    user.assign(userData).write();

    return mutationResult(true, 'User successfully updated!', user.value());
  }
};
