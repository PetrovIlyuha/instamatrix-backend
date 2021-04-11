import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    removePhoto: authGuard(async (_, { photoId }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id: photoId,
        },
        select: {
          userId: true,
        },
      });
      if (!photo) {
        return { ok: false, error: 'Photo was not found!' };
      } else if (photo.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: 'You are trying to remove a photo that you have not created!',
        };
      } else {
        await client.photo.delete({ where: { id: photoId } });
        return { ok: true, error: null };
      }
    }),
  },
};
