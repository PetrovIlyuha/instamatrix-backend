import { config } from 'dotenv';
import express from 'express';
import logger from 'morgan';
config();

import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './schema.js';
import { getUser, authGuard } from './users/users.utils.js';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.auth || '';
      const user = await getUser(token);
      return { loggedInUser: user, authGuard };
    },
  });
  await server.start();

  const app = express();
  app.use('/static', express.static('uploads'));
  app.use(logger('tiny'));
  server.applyMiddleware({ app });

  await new Promise(resolve =>
    app.listen({ port: process.env.SERVER_PORT }, resolve),
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`,
  );
  return { server, app };
}

startServer();
