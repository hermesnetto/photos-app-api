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
      generateId(type: MODEL_TYPES): number {
        return db.get(type).value().length + 1;
      },
      getMutationResult<T>(status: boolean, message: string, data: T): MutationResult<T> {
        return { status, message, data };
      },
      db
    };
  }
});

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
