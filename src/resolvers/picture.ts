import { Picture, GqlPicture, Context, GqlUser, MODEL_TYPES, MutationResult } from '../models';
import { userQueries } from './user';

const key = MODEL_TYPES.Pictures;

export interface CreatePictureInput {
  input: {
    source: string;
    author_id: number;
  };
}

export interface UpdatePictureInput {
  input: {
    id: number;
    source?: string;
  };
}

export interface DeletePictureInput {
  input: {
    id: number;
  };
}

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

export const pictureMutations = {
  /** Creates a new Picture */
  addPicture(_root: {}, { input }: CreatePictureInput, ctx: Context): MutationResult<GqlPicture> {
    const { db, generateId, getMutationResult } = ctx;
    const { source, author_id } = input;

    if (!userQueries.user({}, { id: author_id }, ctx)) {
      return getMutationResult(false, 'User not found!', {});
    }

    const newPicture = {
      source,
      id: generateId(key),
      user_id: author_id
    };

    db.get(key)
      .push(newPicture)
      .write();

    return getMutationResult(true, 'Picture succesfully created!', newPicture);
  },

  /** Updates a Picture */
  updatePicture(
    _root: {},
    { input }: UpdatePictureInput,
    ctx: Context
  ): MutationResult<GqlPicture> {
    const { db, getMutationResult } = ctx;
    const { id, ...data } = input;
    const picture = db.get(key).find({ id });

    if (!picture.value()) {
      return getMutationResult(false, 'Picture not found!', {});
    }

    const updatedPicture = picture.assign(data);
    updatedPicture.write();

    return getMutationResult(true, 'Picture succesfully updated!', updatedPicture.value());
  },

  /** Deletes a Picture */
  deletePicture(_root: {}, { input }: DeletePictureInput, ctx: Context): MutationResult<{}> {
    const { db, getMutationResult } = ctx;
    const { id } = input;

    const pictures = db.get(key);

    if (!pictures.find({ id }).value()) {
      return getMutationResult(false, 'Picture not found!', {});
    }

    pictures.remove({ id }).write();

    return getMutationResult(true, 'Picture succesfully deleted!', {});
  }
};
