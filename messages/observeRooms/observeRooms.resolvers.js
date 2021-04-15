import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Query: {
    observeAllRooms: authGuard(async (_, args, { loggedInUser }) => {
      const rooms = await client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedInUser.in,
            },
          },
        },
      });
      return rooms;
    }),
  },
};
