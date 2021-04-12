import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    createComment: authGuard(
      async (_, { photoId, content }, { loggedInUser }) => {
        const photo = await client.photo.findUnique({
          where: { id: photoId },
          include: { user: true },
        });
        if (photo && photo.user.id === loggedInUser.id) {
          return {
            ok: false,
            error: "You can't post comments for your own photos!",
          };
        }
        if (!photo) {
          return { ok: false, error: 'Photo not found!' };
        }
        await client.comment.create({
          data: {
            content,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        return { ok: true };
      },
    ),
  },
};
