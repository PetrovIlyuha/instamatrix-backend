import client from '../../client';
import { uploadImage } from '../../shared/Shared.utils';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    uploadPhoto: authGuard(async (_, { file, caption }, { loggedInUser }) => {
      if (caption) {
        let hashtags = caption.match(/#[\w]+/g);
        if (hashtags) {
          let hashTagsObjects = hashtags.map(hash => ({
            create: {
              hashtag: hash,
            },
            where: {
              hashtag: hash,
            },
          }));
          const photoImageUrl = await uploadImage(
            file,
            loggedInUser.id,
            'uploads',
          );
          const photo = await client.photo.create({
            data: {
              file: photoImageUrl,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              caption,
              hashtags: {
                connectOrCreate: hashTagsObjects,
              },
            },
          });
          const photoWithUser = await client.photo.findUnique({
            where: { id: photo.id },
            include: { user: true, hashtags: true },
          });
          return photoWithUser;
        } else {
          const photo = await client.photo.create({
            data: {
              file,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              caption,
            },
          });

          const photoWithUser = await client.photo.findUnique({
            where: { id: photo.id },
            include: { user: true, hashtags: true },
          });
          return photoWithUser;
        }
      } else {
        const photo = await client.photo.create({
          data: {
            file,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        const photoWithUser = await client.photo.findUnique({
          where: { id: photo.id },
          include: { user: true, hashtags: true },
        });
        return photoWithUser;
      }
    }),
  },
};
