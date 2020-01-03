import { userQueries, userFields, userMutations } from './user';
import { pictureQueries, pictureFields, pictureMutations } from './picture';
import { postQueries, postFields } from './post';
import { commentQueries, commentFields } from './comment';

export const resolvers = {
  Query: {
    ...userQueries,
    ...pictureQueries,
    ...postQueries,
    ...commentQueries
  },
  Mutation: {
    ...userMutations,
    ...pictureMutations
  },
  MutationResponse: {
    __resolveType(): null {
      return null;
    }
  },
  ...userFields,
  ...pictureFields,
  ...postFields,
  ...commentFields
};
