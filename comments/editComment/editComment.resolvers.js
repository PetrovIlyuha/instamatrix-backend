import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    editComment: authGuard(
      async (_, { commentId, content }, { loggedInUser }) => {
        const comment = await client.comment.findUnique({
          where: { id: commentId },
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: 'Comment you want to be edited was not found!',
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error:
              'You are not allowed to edit comments that belongs to other users',
          };
        } else {
          await client.comment.update({
            where: { id: commentId },
            data: {
              content,
            },
          });
          return { ok: true, error: null };
        }
      },
    ),
  },
};
