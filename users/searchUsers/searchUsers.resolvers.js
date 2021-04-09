import client from '../../client';

export default {
  Query: {
    searchUsers: async (_, { keyword, page }) => {
      try {
        if (keyword.length < 3) {
          return {
            ok: false,
            error: 'You search keyword is too short. No less than 3 characters',
          };
        }
        const usersFound = await client.user.findMany({
          where: {
            username: { contains: keyword, mode: 'insensitive' },
          },
          skip: page ? (page - 1) * 5 : 0,
          take: 5,
        });
        if (!usersFound) {
          return {
            ok: false,
            error:
              'Users with the given username were not found on our platform!',
          };
        }
        return { ok: true, error: null, users: usersFound };
      } catch (err) {
        console.log(err);
        return { ok: false, error: err };
      }
    },
  },
};
