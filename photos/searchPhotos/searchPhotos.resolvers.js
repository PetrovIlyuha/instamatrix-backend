import client from '../../client';

export default {
  Query: {
    searchPhotos: (_, { keyword, page }) => {
      return client.photo.findMany({
        where: { caption: { contains: keyword, mode: 'insensitive' } },
        skip: (page - 1) * 5,
        take: 5,
      });
    },
  },
};
