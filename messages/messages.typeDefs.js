import { gql } from 'apollo-server-express';

export default gql`
  type Message {
    id: Int!
    content: String!
    user: User!
    room: Room!
    hasBeenRead: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type Room {
    id: Int!
    users: [User]
    unreadMessages: Int!
    messages: [Message]
    createdAt: String!
    updatedAt: String!
  }
`;
