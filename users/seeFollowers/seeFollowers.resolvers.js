import client from '../../client';

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
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
        const followers = await client.user
          .findFirst({
            where: {
              username,
            },
            skip: (page - 1) * 5,
            take: 5,
          })
          .followers();
        const followersCount = await client.user.count({
          where: { following: { some: { username } } },
        });

        return {
          ok: true,
          error: null,
          followers,
          totalPages: Math.ceil(followersCount / 5),
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
