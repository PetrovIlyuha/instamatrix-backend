import client from '../../client';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import { authGuard } from '../../users/users.utils';

export default {
  Mutation: {
    sendMessage: authGuard(
      async (_, { content, roomId, userId }, { loggedInUser }) => {
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!user) {
            return { ok: false, error: 'User was not found!' };
          }
          const potentiallyExistingRoom = await client.room.findFirst({
            where: { users: { some: { id: userId } } },
          });
          if (potentiallyExistingRoom) {
            room = potentiallyExistingRoom;
          } else {
            room = await client.room.create({
              data: {
                users: {
                  connect: [{ id: userId }, { id: loggedInUser.id }],
                },
              },
            });
          }
        } else if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });
          if (!room) {
            return {
              ok: false,
              error: 'Room does not exist!',
            };
          }
        }
        const newMessage = await client.message.create({
          data: {
            content,
            room: {
              connect: {
                id: room.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        pubsub.publish(NEW_MESSAGE, {
          roomSubscription: { ...newMessage },
        });
        return {
          ok: true,
          error: null,
        };
      },
    ),
  },
};
