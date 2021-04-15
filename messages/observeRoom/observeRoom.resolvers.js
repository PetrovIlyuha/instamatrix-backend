import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Query: {
    observeRoom: authGuard(async (_, { roomId }, { loggedInUser }) => {
      const room = await client.room.findFirst({
        where: { id: roomId, users: { some: { id: loggedInUser.id } } },
      });
      return room;
    }),
  },
};
