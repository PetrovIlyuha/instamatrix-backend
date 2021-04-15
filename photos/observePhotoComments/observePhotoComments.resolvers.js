import client from '../../client';

const ITEMS_PER_PAGE = 5;

export default {
  Query: {
    observePhotoComments: async (_, { photoId, page }) => {
      const allCommentsPaginated = await client.comment.findMany({
        where: { photoId },
        include: { user: true },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return allCommentsPaginated;
    },
  },
};
