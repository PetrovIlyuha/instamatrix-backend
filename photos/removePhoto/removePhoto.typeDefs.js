import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    removePhoto(photoId: Int!): BasicResponse!
  }
`;
