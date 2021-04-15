import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    sendMessage(content: String!, roomId: Int, userId: Int): BasicResponse!
  }
`;
