import client from '../../client';

export default {
  Query: {
    observePhotoLikes: async (_, { id }) => {
      const usersLikedPhoto = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      return usersLikedPhoto.map(like => like.user);
    },
  },
};
