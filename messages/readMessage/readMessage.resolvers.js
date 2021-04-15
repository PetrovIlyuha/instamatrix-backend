import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    readMessage: authGuard(async (_, { messageId }, { loggedInUser }) => {
      const message = await client.message.findFirst({
        where: {
          id: messageId,
          userId: {
            not: loggedInUser.id,
          },
          room: { users: { some: { id: loggedInUser.id } } },
        },
      });
      if (!message) {
        return { ok: false, error: 'Message was not found!' };
      }
      await client.message.update({
        where: { id: messageId },
        data: {
          hasBeenRead: true,
        },
      });
      return { ok: true, error: null };
    }),
  },
};
