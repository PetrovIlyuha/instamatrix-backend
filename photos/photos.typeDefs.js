import { gql } from 'apollo-server-express';

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    comments: [Comment]
    createdAt: String!
    updatedAt: String!
    likesCount: Int
    commentsCount: Int
    isMyPhoto: Boolean!
    isLikedByMe: Boolean!
    allLikes: [User]
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    createdAt: String!
    totalPhotos: Int!
    updatedAt: String!
  }

  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
