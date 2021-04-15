import client from '../../client';

export default {
  Query: {
    observePhoto: (_, { id }) => {
      return client.photo.findUnique({
        where: { id },
        include: { comments: true, user: true },
      });
    },
  },
};
