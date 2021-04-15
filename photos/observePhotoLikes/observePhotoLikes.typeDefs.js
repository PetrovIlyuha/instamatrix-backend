import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    observePhotoLikes(id: Int!): [User]
  }
`;
