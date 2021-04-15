import client from '../../client';
import { authGuard } from '../../users/users.utils';

const PHOTOS_PER_PAGE = 10;

export default {
  Query: {
    observePhotoFeed: authGuard(async (root, { page }, { loggedInUser }) => {
      const photos = await client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            { userId: loggedInUser.id },
          ],
        },
        include: { comments: true, user: true },
        skip: (page - 1) * PHOTOS_PER_PAGE,
        take: PHOTOS_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return photos;
    }),
  },
};
