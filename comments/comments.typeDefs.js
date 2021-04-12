import { gql } from 'apollo-server-express';

export default gql`
  type Comment {
    id: Int!
    user: User!
    photo: Photo!
    content: String!
    createdByMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
