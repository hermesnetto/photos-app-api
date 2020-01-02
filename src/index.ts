import { ApolloServer } from 'apollo-server';
import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { getDBInstance } from './db';

const db = getDBInstance();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (c: any) => {
    return {
      ...c,
      db
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
