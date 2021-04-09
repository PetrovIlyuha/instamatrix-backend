import { gql } from 'apollo-server-express';

export default gql`
  type UserSearchResults {
    ok: Boolean!
    users: [User]
    error: String
  }
  type Query {
    searchUsers(keyword: String!, page: Int): UserSearchResults!
  }
`;
