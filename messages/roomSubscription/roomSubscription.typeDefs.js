import { gql } from 'apollo-server-express';

export default gql`
  type Subscription {
    roomSubscription(roomId: Int!): Message
  }
`;
