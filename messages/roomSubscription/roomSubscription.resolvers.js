import { withFilter } from 'graphql-subscriptions';
import client from '../../client';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';

export default {
  Subscription: {
    roomSubscription: {
      subscribe: async (root, args, ctx, info) => {
        const room = await client.room.findFirst({
          where: {
            AND: [
              {
                id: args.roomId,
              },
              {
                users: {
                  some: {
                    id: ctx.loggedInUser.id,
                  },
                },
              },
            ],
          },
          select: { id: true },
        });
        if (!room) {
          throw new Error('This should not be happening!');
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomSubscription: { roomId } }, { roomId: roomIdFromUser }) => {
            return roomId === roomIdFromUser;
          },
        )(root, args, ctx, info);
      },
    },
  },
};
