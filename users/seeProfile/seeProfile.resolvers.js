import client from '../../client';

export default {
  Query: {
    seeProfile: async (_, { username }) => {
      try {
        const user = await client.user.findFirst({
          where: { username: { contains: username, mode: 'insensitive' } },
          include: { followers: true, following: true },
        });
        if (user) {
          return user;
        } else {
          throw new Error('User was not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
