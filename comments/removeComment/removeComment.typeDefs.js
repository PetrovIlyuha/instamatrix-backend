import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    removeComment(commentId: Int!): BasicResponse!
  }
`;
