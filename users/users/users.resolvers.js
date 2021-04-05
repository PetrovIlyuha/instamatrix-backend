import client from '../../client';
import { authGuard } from '../users.utils';

export default {
  User: {
    totalFollowing: ({ id }) => {
      const totalFollowing = client.user.count({
        where: {
          followers: {
            some: { id },
          },
        },
      });
      return totalFollowing;
    },
    totalFollowers: ({ id }) => {
      const totalFollowers = client.user.count({
        where: {
          following: { some: { id } },
        },
      });
      return totalFollowers;
    },
    isMyProfile: ({ id }, args, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, args, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const found = await client.user
        .findUnique({ where: { username: loggedInUser.username } })
        .following({
          where: {
            id,
          },
        });
      return found.length !== 0;
    },
    photos: async ({ id }) =>
      client.user.findUnique({ where: { id } }).photos(),
  },
};
