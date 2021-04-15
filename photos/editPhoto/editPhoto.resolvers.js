import client from '../../client';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    editPhoto: authGuard(async (_, { id, caption }, { loggedInUser }) => {
      const photo = await client.photo.findFirst({
        where: { AND: [{ id: id }, { userId: loggedInUser.id }] },
      });
      if (!photo) {
        return { ok: false, error: 'You are not allowed to edit this photo!' };
      } else {
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
          const oldHashtags = await client.photo
            .findFirst({ where: { id } })
            .hashtags();
          const tagsToDisconnectIds = oldHashtags
            .filter(
              tag =>
                !hashTagsObjects
                  .map(t => t.create.hashtag)
                  .includes(tag.hashtag),
            )
            .map(t => ({ id: t.id }));
          const tagsToAdd = hashTagsObjects.filter(
            tag =>
              !oldHashtags.map(t => t.hashtag).includes(tag.create.hashtag),
          );
          const successUpdate = await client.photo.update({
            where: { id },
            data: {
              caption,
              hashtags: {
                disconnect: tagsToDisconnectIds,
                connectOrCreate: tagsToAdd,
              },
            },
          });
          if (!successUpdate) {
            return { ok: false, error: 'Could not update your photo!' };
          }
          return {
            ok: true,
            error: null,
          };
        } else {
          const oldHashtags = await client.photo
            .findFirst({ where: { id } })
            .hashtags();
          const tagsIdsToRemove = oldHashtags.map(tag => ({ id: tag.id }));
          const successUpdate = await client.photo.update({
            where: { id },
            data: {
              caption,
              hashtags: {
                disconnect: tagsIdsToRemove,
              },
            },
          });
          if (!successUpdate) {
            return {
              ok: false,
              error: 'Could not update photo!',
            };
          }
          return { ok: true, error: null };
        }
      }
    }),
  },
};
