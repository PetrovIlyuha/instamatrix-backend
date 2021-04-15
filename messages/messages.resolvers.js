import client from '../client';

export default {
  Room: {
    users: ({ id }) => client.room.findFirst({ where: { id } }).users(),
    messages: ({ id }) => client.message.findMany({ where: { roomId: id } }),
    unreadMessages: ({ id }, args, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      } else {
        return client.message.count({
          where: {
            hasBeenRead: false,
            roomId: id,
            user: {
              id: { not: loggedInUser.id },
            },
          },
        });
      }
    },
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
