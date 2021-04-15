import client from '../client';
import { authGuard } from '../users/users.utils';

export default {
  Photo: {
    user: ({ userId }) => {
      return client.user.findUnique({ where: { id: userId } });
    },
    hashtags: ({ id }) => {
      return client.photo
        .findUnique({
          where: { id },
        })
        .hashtags();
    },
    likesCount: ({ id }) => {
      return client.like.count({ where: { photoId: id } });
    },
    allLikes: ({ id }) => {
      return client.user.findMany({
        where: { likes: { some: { photoId: id } } },
      });
    },
    commentsCount: ({ id }) => {
      return client.comment.count({ where: { photoId: id } });
    },
    comments: ({ id }) => {
      return client.comment.findMany({
        where: { photoId: id },
        include: { user: true },
      });
    },
    isMyPhoto: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return userId === loggedInUser.id;
    },
    isLikedByMe: authGuard(async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      const wasLiked = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
      });
      return wasLiked ? true : false;
    }),
  },
  Hashtag: {
    totalPhotos: ({ id }) => {
      return client.photo.count({ where: { hashtags: { some: { id } } } });
    },
    photos: ({ id }, { page }) => {
      return client.hashtag
        .findFirst({
          where: { id },
          skip: (page - 1) * 5,
          take: 5,
        })
        .photos();
    },
  },
};
