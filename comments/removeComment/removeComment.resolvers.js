import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    removeComment: authGuard(async (_, { commentId }, { loggedInUser }) => {
      const comment = await client.comment.findUnique({
        where: { id: commentId },
        select: { userId: true },
      });
      if (!comment) {
        return { ok: false, error: 'Comment was not found!' };
      } else if (comment.userId !== loggedInUser.id) {
        return {
          ok: false,
          error:
            'You were prevented from removing comment due to lack of ownership!',
        };
      } else {
        await client.comment.delete({ where: { id: commentId } });
        return {
          ok: true,
          error: null,
        };
      }
    }),
  },
};
