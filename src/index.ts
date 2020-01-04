import { ApolloServer } from 'apollo-server';
import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { getDBInstance } from './db';
import { MODEL_TYPES, MutationResult } from './models';

const db = getDBInstance();
const port = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context: any) => {
    /**
     * @TODO Add the right types for context
     * @TODO Resolve n + 1 problem
     */
    return {
      ...context,
      /**
       * @TODO Implement better function to generate the ID's
       */
      generateId(type: MODEL_TYPES): number {
        return db.get(type).value().length + 1;
      },
      mutationResult<T>(success: boolean, message: string, data: T): MutationResult<T> {
        return { success, message, data };
      },
      db
    };
  }
});

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
