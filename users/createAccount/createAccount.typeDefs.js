import { gql } from 'apollo-server-core';

export default gql`
  type CreateAccountResponse {
    ok: Boolean!
    error: String
    user: User
  }
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): CreateAccountResponse!
  }
`;
