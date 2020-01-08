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
    user(media: DBMedia, _args: {}, ctx: Context): GqlUser {
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

export const mediaMutations = {
  uploadMedia: (_, { file: { _parts } }) => {
    _parts.forEach(([name, file]) => {
      try {
        cloudinary.uploader.upload(file.uri, {}, (error, result) => {
          console.log(error, result);
        });

        // const result = await new Promise((resolve, reject) => {
        //   createReadStream().pipe(
        //     cloudinary.uploader.upload_stream((error, result) => {
        //       if (error) {
        //         reject(error);
        //       }

        //       resolve(result);
        //     })
        //   );
        // });

        // const newPicture = { filename, path: result.secure_url };

        // console.log(newPicture);

        // photos.push(newPicture)

        // return newPicture;
      } catch (err) {
        console.log(err);
      }
    });

    return { ok: true };

    // const { filename, createReadStream } = await file;
  }
};
