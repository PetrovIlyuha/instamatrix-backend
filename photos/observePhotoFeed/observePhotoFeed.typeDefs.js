import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    observePhotoFeed(page: Int!): [Photo]
  }
`;
