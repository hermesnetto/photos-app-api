import { userQueries, userMutations, userFields } from './user';
import { pictureQueries, pictureFields } from './picture';
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
    ...userMutations
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
