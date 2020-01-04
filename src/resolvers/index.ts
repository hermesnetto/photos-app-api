import { userQueries, userFields, userMutations } from './user';
import { mediaQueries, mediaFields } from './media';
import { postQueries, postFields, postMutations } from './post';
import { commentQueries, commentFields, commentMutations } from './comment';

export const resolvers = {
  Query: {
    ...userQueries,
    ...mediaQueries,
    ...postQueries,
    ...commentQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations,
    ...commentMutations
  },
  MutationResponse: {
    __resolveType(): null {
      return null;
    }
  },
  ...userFields,
  ...mediaFields,
  ...postFields,
  ...commentFields
};
