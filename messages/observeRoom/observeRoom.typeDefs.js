import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    observeRoom(roomId: Int!): Room!
  }
`;
