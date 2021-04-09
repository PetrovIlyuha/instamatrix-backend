import { config } from 'dotenv';
import http from 'http';
import express from 'express';
import logger from 'morgan';
config();

import pubsub from './pubsub.js';

import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './schema.js';
import { getUser, authGuard } from './users/users.utils.js';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ctx => {
      if (ctx.req) {
        const token = ctx.req.headers.auth || '';
        const user = await getUser(token);
        return { loggedInUser: user, authGuard };
      } else {
        return { loggedInUser: ctx.connection.context.loggedInUser };
      }
    },
    subscriptions: {
      onConnect: async ({ auth }) => {
        if (!auth) {
          throw new Error(
            'You are not allowed in the chats! Login, please, dear hacker!',
          );
        }
        const user = await getUser(auth);
        return { loggedInUser: user };
      },
    },
  });
  await server.start();

  const app = express();
  app.use('/static', express.static('uploads'));
  app.use(logger('tiny'));
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  await new Promise(resolve =>
    httpServer.listen({ port: process.env.SERVER_PORT }, resolve),
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`,
  );
  return { server, app };
}

startServer();
