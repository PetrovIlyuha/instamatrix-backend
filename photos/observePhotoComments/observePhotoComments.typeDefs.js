import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    observePhotoComments(photoId: Int!, page: Int!): [Comment]
  }
`;
