import { ApolloServer } from 'apollo-server';
import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { getDBInstance } from './db';

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
    return { ...context, db };
  }
});

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
