import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    toggleLike: authGuard(async (_, { id }, { loggedInUser }) => {
      try {
        const photo = await client.photo.findUnique({ where: { id } });
        if (!photo) {
          return { ok: false, error: 'Photo was not found' };
        }
        const like = await client.like.findUnique({
          where: {
            photoId_userId: {
              userId: loggedInUser.id,
              photoId: photo.id,
            },
          },
        });

        if (like) {
          await client.like.delete({
            where: {
              photoId_userId: {
                userId: loggedInUser.id,
                photoId: photo.id,
              },
            },
          });
          return { ok: true, error: null };
        } else {
          await client.like.create({
            data: {
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              photo: {
                connect: {
                  id: photo.id,
                },
              },
            },
          });
          return { ok: true, error: null };
        }
      } catch (err) {
        return { ok: false, error: err };
      }
    }),
  },
};
