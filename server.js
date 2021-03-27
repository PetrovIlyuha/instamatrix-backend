import { config } from 'dotenv';
config();

import { ApolloServer } from 'apollo-server';
import schema from './schema.js';

const server = new ApolloServer({ schema });

server.listen(process.env.SERVER_PORT).then(() => {
  console.log(
    `Apollo Server is running on port http://localhost:${process.env.SERVER_PORT}/`,
  );
});
