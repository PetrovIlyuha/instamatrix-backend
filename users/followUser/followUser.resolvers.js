import client from '../../client';
import { authGuard } from '../users.utils';

const followUserFn = async (_, { username }, { loggedInUser }) => {
  try {
    const aboutToFollowUser = await client.user.findFirst({
      where: { username },
    });
    if (!aboutToFollowUser) {
      return {
        ok: false,
        error: 'User you wanted to follow is an ethereal ghost!',
      };
    }
    await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        following: {
          connect: {
            username,
          },
        },
      },
    });
    return { ok: true, error: 'No errors' };
  } catch (err) {
    return { ok: false, error: err };
  }
};

export default {
  Mutation: {
    followUser: authGuard(followUserFn),
  },
};
