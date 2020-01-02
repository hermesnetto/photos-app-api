import { userResolvers, userFieldResolvers } from './user';
import { pictureResolvers, pictureFieldResolvers } from './picture';
import { postResolvers, postFieldResolvers } from './post';
import { commentResolvers, commentFieldResolvers } from './comment';

export const resolvers = {
  Query: {
    ...userResolvers,
    ...pictureResolvers,
    ...postResolvers,
    ...commentResolvers
  },
  ...userFieldResolvers,
  ...pictureFieldResolvers,
  ...postFieldResolvers,
  ...commentFieldResolvers
};
