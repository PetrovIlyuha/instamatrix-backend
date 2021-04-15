import client from '../../client';

export default {
  Query: {
    observeHashtag: async (_, { hashtag }) => {
      return client.hashtag.findFirst({
        where: { hashtag: { contains: hashtag, mode: 'insensitive' } },
      });
    },
  },
};
