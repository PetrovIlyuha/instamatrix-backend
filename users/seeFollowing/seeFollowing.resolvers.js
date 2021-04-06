import client from '../../client';

export default {
  Query: {
    seeFollowing: async (_, { username, lastReadCursorPointer }) => {
      try {
        const userFound = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!userFound) {
          return {
            ok: false,
            error: 'User was not found on our platform!',
          };
        }
        const following = await client.user
          .findFirst({
            where: {
              username,
            },
            skip: lastReadCursorPointer ? 1 : 0,
            take: 5,
            ...(lastReadCursorPointer && {
              cursor: { id: lastReadCursorPointer },
            }),
          })
          .following();
        return {
          ok: true,
          error: null,
          following,
        };
      } catch (err) {
        return {
          ok: false,
          error: err,
        };
      }
    },
  },
};
